"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function QuizInterface({ assessment, onBack }) {
    const router = useRouter();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [isSubmitted, setIsSubmitted] = useState(assessment.isCompleted || false);
    const [results, setResults] = useState(null);

    const currentQuestion = assessment.questions[currentQuestionIndex];
    const totalQuestions = assessment.questions.length;

    useEffect(() => {
        if (assessment.isCompleted) {
            const resultsData = {
                score: assessment.score,
                total: assessment.totalQuestions,
                details: assessment.questions.map((q) => ({
                    questionId: q.questionId,
                    question: q.question,
                    userAnswer: q.userAnswer,
                    correctAnswer: q.correctAnswer,
                    isCorrect: q.isCorrect,
                    explanation: q.explanation,
                })),
            };
            setResults(resultsData);
            setIsSubmitted(true);

            const answers = {};
            assessment.questions.forEach((q, index) => {
                if (q.userAnswer) {
                    answers[index] = q.userAnswer;
                }
            });
            setSelectedAnswers(answers);
        }
    }, [assessment]);

    const handleOptionSelect = (optionLetter) => {
        if (isSubmitted) return;

        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: optionLetter,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < totalQuestions - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleQuestionNavigate = (index) => {
        setCurrentQuestionIndex(index);
    };

    const handleSubmit = async () => {
        try {
            const response = await fetch('/api/submit-quiz', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    assessmentId: assessment.id,
                    answers: selectedAnswers,
                }),
            });

            const data = await response.json();

            if (data.success) {
                router.push(`/dashboard/${assessment.id}`);
            }
        } catch (error) {
            console.error('Error submitting quiz:', error);
        }
    };

    const getAnsweredCount = () => {
        return Object.keys(selectedAnswers).length;
    };

    return (
        <div className="mx-auto w-full max-w-4xl px-6 py-8">
            <div className="mb-6 flex items-center justify-between">
                <button
                    onClick={onBack}
                    className="text-sm text-zinc-400 hover:text-zinc-200"
                >
                    ← Back
                </button>
                <div className="text-sm text-zinc-400">
                    {getAnsweredCount()} of {totalQuestions} answered
                </div>
            </div>

            <div className="mb-6 rounded-2xl border border-white/10 bg-white/5 p-6">
                <div className="mb-4 flex items-center justify-between">
                    <span className="text-xs font-medium text-zinc-500">
                        Question {currentQuestionIndex + 1} of {totalQuestions}
                    </span>
                    <div className="flex gap-2">
                        {Array.from({ length: totalQuestions }).map((_, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuestionNavigate(index)}
                                className={`h-2 w-2 rounded-full transition-colors ${index === currentQuestionIndex
                                    ? 'bg-red-600'
                                    : selectedAnswers[index]
                                        ? 'bg-green-500'
                                        : 'bg-white/20'
                                    }`}
                            />
                        ))}
                    </div>
                </div>

                <h3 className="text-xl font-medium text-zinc-100">
                    {currentQuestion.question}
                </h3>

                <div className="mt-6 space-y-3">
                    {currentQuestion.options.map((option) => (
                        <button
                            key={option.id}
                            onClick={() => handleOptionSelect(option.option)}
                            className={`w-full rounded-xl border p-4 text-left transition-colors ${selectedAnswers[currentQuestionIndex] === option.option
                                ? 'border-red-500 bg-red-500/10'
                                : 'border-white/10 bg-white/5 hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-start gap-3">
                                <span
                                    className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${selectedAnswers[currentQuestionIndex] === option.option
                                        ? 'bg-red-600 text-white'
                                        : 'bg-white/10 text-zinc-300'
                                        }`}
                                >
                                    {option.option}
                                </span>
                                <span className="text-sm text-zinc-200">{option.text}</span>
                            </div>
                        </button>
                    ))}
                </div>
            </div>

            <div className="flex items-center justify-between">
                <button
                    onClick={handlePrevious}
                    disabled={currentQuestionIndex === 0}
                    className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Previous
                </button>

                <div className="flex gap-3">
                    {currentQuestionIndex === totalQuestions - 1 ? (
                        <button
                            onClick={handleSubmit}
                            disabled={getAnsweredCount() < totalQuestions}
                            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Submit Quiz
                        </button>
                    ) : (
                        <button
                            onClick={handleNext}
                            className="rounded-xl bg-red-600 px-6 py-3 text-sm font-medium text-white hover:bg-red-700"
                        >
                            Next
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-6 grid grid-cols-5 gap-2 sm:grid-cols-10">
                {Array.from({ length: totalQuestions }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => handleQuestionNavigate(index)}
                        className={`aspect-square rounded-lg border text-xs font-medium transition-colors ${index === currentQuestionIndex
                            ? 'border-red-500 bg-red-500/20 text-red-400'
                            : selectedAnswers[index]
                                ? 'border-green-500/30 bg-green-500/10 text-green-400'
                                : 'border-white/10 bg-white/5 text-zinc-400 hover:bg-white/10'
                            }`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>
        </div>
    );
}
