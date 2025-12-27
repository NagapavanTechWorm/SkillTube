from flask import Flask, request, jsonify
from flask_cors import CORS
from langchain_community.document_loaders import YoutubeLoader
from langchain_community.document_loaders.youtube import TranscriptFormat
from langchain.chat_models import init_chat_model
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser
from pydantic import BaseModel, Field
from typing import List
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get API keys from environment
os.environ["OPENAI_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
os.environ["GOOGLE_API_KEY"] = os.getenv("GOOGLE_API_KEY", "")

# Default model (change this to switch models easily)
DEFAULT_MODEL = os.getenv("AI_MODEL", "openai:gpt-4o-mini")
# Options: 
# - "openai:gpt-4o-mini"
# - "openai:gpt-4o"
# - "google_genai:gemini-2.5-flash-lite"
# - "google_genai:gemini-1.5-flash"
# - "google_genai:gemini-1.5-pro"

# Define the structure for MCQ questions
class MCQOption(BaseModel):
    option: str = Field(description="The option letter (A, B, C, D)")
    text: str = Field(description="The option text")

class MCQQuestion(BaseModel):
    question: str = Field(description="The question text")
    options: List[MCQOption] = Field(description="List of 4 options")
    correct_answer: str = Field(description="The correct option letter")
    explanation: str = Field(description="Explanation for the correct answer")

class MCQResponse(BaseModel):
    questions: List[MCQQuestion] = Field(description="List of MCQ questions")

def get_llm(model_name: str = DEFAULT_MODEL, temperature: float = 0.7):
    """
    Initialize the LLM using init_chat_model
    
    Args:
        model_name: Model identifier in format "provider:model"
                   e.g., "openai:gpt-4o-mini" or "google_genai:gemini-2.5-flash-lite"
        temperature: Temperature for generation
    
    Returns:
        Initialized LLM instance
    """
    try:
        llm = init_chat_model(
            model_name,
            temperature=temperature
        )
        return llm
    except Exception as e:
        raise ValueError(f"Failed to initialize model '{model_name}': {str(e)}")

def generate_mcqs(youtube_url: str, num_questions: int = 5, model_name: str = DEFAULT_MODEL):
    """Generate MCQ questions from a YouTube video"""
    
    # Load YouTube transcript
    loader = YoutubeLoader.from_youtube_url(
        youtube_url,
        add_video_info=False,
        transcript_format=TranscriptFormat.CHUNKS,
        chunk_size_seconds=30,
    )
    
    documents = loader.load()
    
    # Combine all chunks into one text
    transcript_text = "\n\n".join([doc.page_content for doc in documents])
    
    # Initialize the LLM
    llm = get_llm(model_name)
    
    # Set up the JSON output parser
    parser = JsonOutputParser(pydantic_object=MCQResponse)
    
    # Create the prompt template
    prompt = ChatPromptTemplate.from_messages([
        ("system", "You are an expert educator who creates high-quality multiple-choice questions based on video content."),
        ("user", f"""Based on the following video transcript, generate {num_questions} multiple-choice questions (MCQs) that test understanding of the key concepts.

Each question should have:
- A clear question
- 4 options (A, B, C, D)
- The correct answer
- An explanation for why that answer is correct

Transcript:
{{transcript}}

{{format_instructions}}""")
    ])
    
    # Add format instructions to the prompt
    prompt = prompt.partial(format_instructions=parser.get_format_instructions())
    
    # Create the chain
    chain = prompt | llm | parser
    
    # Generate MCQs (limit text to avoid token limits)
    result = chain.invoke({"transcript": transcript_text[:8000]})
    
    return result

@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_google = bool(os.getenv("GOOGLE_API_KEY"))
    
    available_models = []
    if has_openai:
        available_models.extend([
            "openai:gpt-4o-mini",
            "openai:gpt-4o",
            "openai:gpt-3.5-turbo"
        ])
    if has_google:
        available_models.extend([
            "google_genai:gemini-2.5-flash-lite",
            "google_genai:gemini-1.5-flash",
            "google_genai:gemini-1.5-pro"
        ])
    
    return jsonify({
        "status": "ok", 
        "message": "API is running",
        "default_model": DEFAULT_MODEL,
        "available_models": available_models,
        "providers": {
            "openai": has_openai,
            "google": has_google
        }
    }), 200

@app.route('/generate-mcqs', methods=['POST'])
def generate_mcqs_endpoint():
    """
    Endpoint to generate MCQ questions from a YouTube video
    
    Request body:
    {
        "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
        "num_questions": 5,  // optional, defaults to 5
        "model": "openai:gpt-4o-mini"  // optional, defaults to DEFAULT_MODEL
    }
    
    Available models:
    - OpenAI: "openai:gpt-4o-mini", "openai:gpt-4o", "openai:gpt-3.5-turbo"
    - Google: "google_genai:gemini-2.5-flash-lite", "google_genai:gemini-1.5-flash", "google_genai:gemini-1.5-pro"
    
    Response:
    {
        "success": true,
        "data": {
            "questions": [...]
        },
        "model": "openai:gpt-4o-mini"
    }
    """
    try:
        # Get request data
        data = request.get_json()
        
        if not data:
            return jsonify({
                "success": False,
                "error": "No JSON data provided"
            }), 400
        
        youtube_url = data.get('youtube_url')
        num_questions = data.get('num_questions', 5)
        model_name = data.get('model', DEFAULT_MODEL)
        
        # Validate inputs
        if not youtube_url:
            return jsonify({
                "success": False,
                "error": "youtube_url is required"
            }), 400
        
        if not isinstance(num_questions, int) or num_questions < 1 or num_questions > 20:
            return jsonify({
                "success": False,
                "error": "num_questions must be an integer between 1 and 20"
            }), 400
        
        # Generate MCQs
        result = generate_mcqs(youtube_url, num_questions, model_name)
        
        return jsonify({
            "success": True,
            "data": result,
            "model": model_name
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/generate-mcqs', methods=['GET'])
def generate_mcqs_get():
    """
    GET endpoint for testing
    Query parameters: youtube_url, num_questions, model
    """
    try:
        youtube_url = request.args.get('youtube_url')
        num_questions = int(request.args.get('num_questions', 5))
        model_name = request.args.get('model', DEFAULT_MODEL)
        
        if not youtube_url:
            return jsonify({
                "success": False,
                "error": "youtube_url query parameter is required"
            }), 400
        
        result = generate_mcqs(youtube_url, num_questions, model_name)
        
        return jsonify({
            "success": True,
            "data": result,
            "model": model_name
        }), 200
        
    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/models', methods=['GET'])
def list_models():
    """List all available models"""
    has_openai = bool(os.getenv("OPENAI_API_KEY"))
    has_google = bool(os.getenv("GOOGLE_API_KEY"))
    
    models = {
        "openai": {
            "available": has_openai,
            "models": [
                {"id": "openai:gpt-4o-mini", "name": "GPT-4o Mini", "description": "Fast and efficient"},
                {"id": "openai:gpt-4o", "name": "GPT-4o", "description": "Most capable OpenAI model"},
                {"id": "openai:gpt-3.5-turbo", "name": "GPT-3.5 Turbo", "description": "Fast and affordable"}
            ]
        },
        "google": {
            "available": has_google,
            "models": [
                {"id": "google_genai:gemini-2.5-flash-lite", "name": "Gemini 2.5 Flash Lite", "description": "Ultra-fast and efficient"},
                {"id": "google_genai:gemini-1.5-flash", "name": "Gemini 1.5 Flash", "description": "Fast and capable"},
                {"id": "google_genai:gemini-1.5-pro", "name": "Gemini 1.5 Pro", "description": "Most capable Google model"}
            ]
        }
    }
    
    return jsonify({
        "success": True,
        "default_model": DEFAULT_MODEL,
        "models": models
    }), 200

if __name__ == '__main__':
    print(f"🚀 Starting server with default model: {DEFAULT_MODEL}")
    print(f"✅ OpenAI available: {bool(os.getenv('OPENAI_API_KEY'))}")
    print(f"✅ Google available: {bool(os.getenv('GOOGLE_API_KEY'))}")
    app.run(debug=True, host='0.0.0.0', port=5000)