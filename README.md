# SkillTube

SkillTube is an **AI-enabled assessment platform** that generates multiple-choice questions from YouTube videos.

## Features

- 🎥 Paste a **YouTube link**
- 🤖 **AI-powered MCQ generation** using OpenAI or Google Gemini
- 📝 Take assessments to test and improve your skills
- 🔐 Google OAuth authentication
- 💾 Database-backed session management

## Project Structure

This repository contains two main components:

- **`ai-api/`** - Flask API for AI-powered MCQ generation from YouTube transcripts
- **`web-app/`** - Next.js web application with authentication and dashboard

## Tech Stack

### Web App
- Next.js 16 (App Router)
- Prisma + PostgreSQL
- NextAuth (Google OAuth) with database-backed sessions
- TailwindCSS v4
- React 19

### AI API
- Flask + Flask-CORS
- LangChain (OpenAI & Google GenAI)
- YouTube Transcript API
- Pydantic for data validation

## Prerequisites

- **Node.js** (LTS recommended)
- **Python 3.8+**
- **PostgreSQL** running locally
- **Google OAuth credentials** (for web app authentication)
- **OpenAI API Key** and/or **Google API Key** (for AI features)

---

## Setup Instructions

### 1. AI API Setup

#### Install Python Dependencies

Navigate to the `ai-api/` folder and install dependencies:

```bash
cd ai-api
pip install -r requirements.txt
```

#### Configure AI API Environment Variables

Create `ai-api/.env` based on `.env.example`:

```env
GOOGLE_API_KEY="your-google-api-key"
OPENAI_API_KEY="your-openai-api-key"
AI_MODEL=google_genai:gemini-2.5-flash-lite
```

**Available Models:**
- **OpenAI**: `openai:gpt-4o-mini`, `openai:gpt-4o`, `openai:gpt-3.5-turbo`
- **Google**: `google_genai:gemini-2.5-flash-lite`, `google_genai:gemini-1.5-flash`, `google_genai:gemini-1.5-pro`

**Note:** You need at least one API key (OpenAI or Google) to use the AI features.

#### Run the AI API

```bash
python app.py
```

The API will start on `http://localhost:5000`

**API Endpoints:**
- `GET /health` - Health check and available models
- `POST /generate-mcqs` - Generate MCQs from YouTube URL
- `GET /models` - List all available AI models

---

### 2. Web App Setup

#### Configure Web App Environment Variables

Create / update `web-app/.env`:

```env
DATABASE_URL="postgresql://postgres:12345@localhost:5432/postgres?schema=public"

NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-a-random-secret>"

GOOGLE_CLIENT_ID="<google-client-id>"
GOOGLE_CLIENT_SECRET="<google-client-secret>"
```

Generate a secure `NEXTAUTH_SECRET`:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Google OAuth Setup

In Google Cloud Console:

1. Create OAuth Client ID (Web application)
2. Add an authorized redirect URI:

```
http://localhost:3000/api/auth/callback/google
```

#### Install Web App Dependencies

From the `web-app/` folder:

```bash
cd web-app
npm install
```

#### Database Setup (Prisma)

Run migrations:

```bash
npx prisma migrate dev
```

**Windows EPERM Error Fix:**  
If you encounter a Windows `EPERM` error when generating Prisma Client (due to file locks / antivirus / OneDrive sync):

1. Stop running Node/Next processes
2. Re-run:

```bash
npx prisma generate
```

#### Run the Web App

```bash
npm run dev
```

The web app will start on `http://localhost:3000`

**Available Routes:**
- **Landing page**: `http://localhost:3000/`
- **Login**: `http://localhost:3000/login`
- **Dashboard** (protected): `http://localhost:3000/dashboard`

---

## Running the Complete Application

To run the full SkillTube application, you need **both** services running:

1. **Terminal 1** - Start the AI API:
   ```bash
   cd ai-api
   python app.py
   ```
   Running on `http://localhost:5000`

2. **Terminal 2** - Start the Web App:
   ```bash
   cd web-app
   npm run dev
   ```
   Running on `http://localhost:3000`

---

## Detailed Project Structure

### AI API (`ai-api/`)
```
ai-api/
├── app.py              # Flask API with MCQ generation endpoints
├── requirements.txt    # Python dependencies
├── .env.example        # Environment variables template
└── .env               # Your environment variables (create this)
```

### Web App (`web-app/`)
```
web-app/
├── app/
│   ├── page.js                           # Landing page
│   ├── login/page.js                     # Login (Google sign-in)
│   ├── dashboard/page.js                 # Dashboard (YouTube URL input)
│   └── api/
│       ├── auth/[...nextauth]/route.js   # NextAuth handler
│       └── generate-mcqs/route.js        # MCQ generation proxy
├── components/
│   ├── dashboard/                        # Dashboard UI components
│   └── take-test/                        # Test-taking components
├── lib/
│   ├── auth.js                           # Auth configuration
│   ├── prisma.js                         # Prisma client
│   └── websocket.js                      # WebSocket utilities
├── prisma/
│   ├── schema.prisma                     # Database schema
│   └── migrations/                       # Database migrations
└── package.json                          # Node dependencies
```

---

## API Usage Examples

### Generate MCQs from YouTube Video

**Request:**
```bash
curl -X POST http://localhost:5000/generate-mcqs \
  -H "Content-Type: application/json" \
  -d '{
    "youtube_url": "https://www.youtube.com/watch?v=VIDEO_ID",
    "num_questions": 10,
    "model": "google_genai:gemini-2.5-flash-lite"
  }'
```

**Response:**
```json
{
  "success": true,
  "model": "google_genai:gemini-2.5-flash-lite",
  "data": {
    "questions": [
      {
        "question": "What is the main topic?",
        "options": [
          {"option": "A", "text": "Option A"},
          {"option": "B", "text": "Option B"},
          {"option": "C", "text": "Option C"},
          {"option": "D", "text": "Option D"}
        ],
        "correct_answer": "A",
        "explanation": "Explanation text..."
      }
    ]
  }
}
```

### Check Available Models

```bash
curl http://localhost:5000/models
```

---

## Troubleshooting

### AI API Issues

- **Missing API Keys**: Ensure you have at least one API key (OpenAI or Google) in `ai-api/.env`
- **YouTube Transcript Unavailable**: Some videos don't have transcripts available
- **Model Not Found**: Check that your API key matches the model provider you're using

### Web App Issues

- **Database Connection Error**: Verify PostgreSQL is running and `DATABASE_URL` is correct
- **Google OAuth Error**: Check that redirect URI is properly configured in Google Cloud Console
- **Prisma Client Error**: Run `npx prisma generate` to regenerate the client

---

## Author

Built by **Nagapavan A**
