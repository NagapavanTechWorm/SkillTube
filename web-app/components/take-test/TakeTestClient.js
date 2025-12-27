"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";

export default function TakeTestClient() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const { data: session } = useSession();

    const [isGenerating, setIsGenerating] = useState(true);
    const [assessment, setAssessment] = useState(null);
    const [error, setError] = useState(null);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [hasStarted, setHasStarted] = useState(false);
    const hasGeneratedRef = useRef(false);

    useEffect(() => {
        const url = searchParams.get('url');
        if (url && session?.user?.id && !hasGeneratedRef.current) {
            hasGeneratedRef.current = true;
            generateMCQs(url);
        }
    }, [searchParams, session]);

    const generateMCQs = async (youtubeUrl) => {
        try {
            setIsGenerating(true);
            setError(null);

            const response = await fetch('/api/generate-mcqs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    youtubeUrl: youtubeUrl,
                    numQuestions: 10,
                }),
            });

            const data = await response.json();

            if (data.success) {
                setAssessment(data.assessment);
                setIsGenerating(false);
            } else {
                setError(data.error || 'Failed to generate MCQs');
                setIsGenerating(false);
            }
        } catch (err) {
            console.error('Error generating MCQs:', err);
            setError('Failed to generate MCQs. Please try again.');
            setIsGenerating(false);
        }
    };

    const handleStartAssessment = () => {
        setHasStarted(true);
    };

    const handleOptionSelect = (optionLetter) => {
        setSelectedAnswers({
            ...selectedAnswers,
            [currentQuestionIndex]: optionLetter,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < assessment.questions.length - 1) {
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

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mb-4 text-red-400">{error}</div>
                    <button
                        onClick={() => router.push('/dashboard')}
                        className="text-sm text-zinc-400 hover:text-zinc-200"
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>
        );
    }

    if (isGenerating) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4">
                <div className="flex flex-col items-center">
                    {/* Animated Spinner */}
                    <div className="relative mb-8 sm:mb-12">
                        <div className="relative h-32 w-32 sm:h-40 sm:w-40">
                            {/* Outer ring */}
                            <div className="absolute inset-0 rounded-full border-4 border-red-600/10"></div>
                            {/* Spinning rings */}
                            <div className="absolute inset-0 animate-spin rounded-full border-4 border-transparent border-t-red-600 border-r-red-600"></div>
                            <div className="absolute inset-3 animate-spin rounded-full border-4 border-transparent border-t-red-500 border-r-red-500 [animation-delay:150ms] [animation-duration:1.5s]"></div>
                            <div className="absolute inset-6 animate-spin rounded-full border-4 border-transparent border-t-red-400 border-r-red-400 [animation-delay:300ms] [animation-duration:2s]"></div>
                            {/* Center icon */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <svg className="h-10 w-10 sm:h-12 sm:w-12 text-red-500 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Text Content */}
                    <div className="mb-6 sm:mb-8 text-center px-4">
                        <h2 className="text-2xl sm:text-3xl font-bold text-zinc-50 mb-2 sm:mb-3">Generating Your Assessment</h2>
                        <p className="text-sm sm:text-base text-zinc-400 max-w-md">
                            AI is analyzing the video and creating personalized questions for you...
                        </p>
                    </div>

                    {/* Progress Bar */}
                    <div className="mb-8 sm:mb-10 w-64 sm:w-80">
                        <div className="relative h-2 overflow-hidden rounded-full bg-white/5">
                            <div className="absolute inset-0 bg-gradient-to-r from-red-600 via-red-500 to-red-600 animate-[shimmer_2s_ease-in-out_infinite] bg-[length:200%_100%]"></div>
                        </div>
                    </div>

                    {/* Bouncing Dots */}
                    <div className="flex items-center justify-center gap-2">
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-bounce rounded-full bg-red-600 [animation-delay:0ms]"></div>
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-bounce rounded-full bg-red-500 [animation-delay:150ms]"></div>
                        <div className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-bounce rounded-full bg-red-400 [animation-delay:300ms]"></div>
                    </div>
                </div>
            </div>
        );
    }

    if (assessment && !hasStarted) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black px-4">
                <div className="flex flex-col items-center">
                    {/* Success Icon */}
                    <div className="mb-8 sm:mb-10 inline-flex h-20 w-20 sm:h-24 sm:w-24 items-center justify-center rounded-full bg-green-500/20 ring-4 ring-green-500/10">
                        <svg className="h-10 w-10 sm:h-12 sm:w-12 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>

                    {/* Text Content */}
                    <div className="mb-10 sm:mb-12 text-center px-4">
                        <h2 className="mb-3 sm:mb-4 text-3xl sm:text-4xl font-bold text-zinc-50">Assessment Ready!</h2>
                        <p className="mb-2 text-lg sm:text-xl text-zinc-300">
                            {assessment.questions.length} questions generated
                        </p>
                        <p className="text-sm sm:text-base text-zinc-500">
                            Take your time and answer carefully
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="flex flex-col items-center gap-4 w-full max-w-xs">
                        <button
                            onClick={handleStartAssessment}
                            className="group relative overflow-hidden rounded-xl bg-red-600 px-10 sm:px-12 py-3.5 sm:py-4 text-base sm:text-lg font-semibold text-white transition-all hover:bg-red-700 hover:scale-105 hover:shadow-lg hover:shadow-red-600/50 w-full"
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                Start Assessment
                                <svg className="h-4 w-4 sm:h-5 sm:w-5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </span>
                        </button>

                        <button
                            onClick={() => router.push('/dashboard')}
                            className="text-sm sm:text-base text-zinc-400 hover:text-zinc-200 transition-colors"
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (assessment && hasStarted) {
        const currentQuestion = assessment.questions[currentQuestionIndex];
        const totalQuestions = assessment.questions.length;

        return (
            <div className="fixed inset-0 z-50 flex flex-col bg-black">
                <div className="border-b border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-2 sm:gap-4">
                            <span className="text-xs sm:text-sm font-medium text-zinc-400">
                                Q {currentQuestionIndex + 1}/{totalQuestions}
                            </span>
                            <div className="hidden sm:flex gap-1">
                                {Array.from({ length: totalQuestions }).map((_, index) => (
                                    <div
                                        key={index}
                                        className={`h-2 w-8 rounded-full transition-colors ${index === currentQuestionIndex
                                            ? 'bg-red-600'
                                            : selectedAnswers[index]
                                                ? 'bg-green-500'
                                                : 'bg-white/20'
                                            }`}
                                    />
                                ))}
                            </div>
                        </div>
                        <div className="text-xs sm:text-sm text-zinc-400">
                            {getAnsweredCount()}/{totalQuestions}
                        </div>
                    </div>
                </div>

                <div className="flex flex-1 items-center justify-center overflow-y-auto px-4 sm:px-6 py-6 sm:py-8">
                    <div className="w-full max-w-3xl">
                        <h2 className="mb-6 sm:mb-8 text-xl sm:text-2xl font-medium text-zinc-50">
                            {currentQuestion.question}
                        </h2>

                        <div className="space-y-3">
                            {currentQuestion.options.map((option) => (
                                <button
                                    key={option.id}
                                    onClick={() => handleOptionSelect(option.option)}
                                    className={`w-full rounded-xl border p-4 sm:p-6 text-left transition-all ${selectedAnswers[currentQuestionIndex] === option.option
                                        ? 'border-red-500 bg-red-500/10 scale-[1.02]'
                                        : 'border-white/10 bg-white/5 hover:bg-white/10 hover:border-white/20'
                                        }`}
                                >
                                    <div className="flex items-start gap-3 sm:gap-4">
                                        <span
                                            className={`inline-flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-medium transition-colors ${selectedAnswers[currentQuestionIndex] === option.option
                                                ? 'bg-red-600 text-white'
                                                : 'bg-white/10 text-zinc-300'
                                                }`}
                                        >
                                            {option.option}
                                        </span>
                                        <span className="text-sm sm:text-base text-zinc-200">{option.text}</span>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="border-t border-white/10 px-4 sm:px-6 py-3 sm:py-4">
                    <div className="flex items-center justify-between gap-2">
                        <button
                            onClick={handlePrevious}
                            disabled={currentQuestionIndex === 0}
                            className="rounded-xl border border-white/15 bg-white/5 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-zinc-100 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <span className="hidden sm:inline">← Previous</span>
                            <span className="sm:hidden">←</span>
                        </button>

                        <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide">
                            {Array.from({ length: totalQuestions }).map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => handleQuestionNavigate(index)}
                                    className={`h-8 w-8 sm:h-10 sm:w-10 shrink-0 rounded-lg border text-xs sm:text-sm font-medium transition-colors ${index === currentQuestionIndex
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

                        {currentQuestionIndex === totalQuestions - 1 ? (
                            <button
                                onClick={handleSubmit}
                                disabled={getAnsweredCount() < totalQuestions}
                                className="rounded-xl bg-red-600 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <span className="hidden sm:inline">Submit →</span>
                                <span className="sm:hidden">Submit</span>
                            </button>
                        ) : (
                            <button
                                onClick={handleNext}
                                className="rounded-xl bg-red-600 px-4 sm:px-6 py-2 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-red-700"
                            >
                                <span className="hidden sm:inline">Next →</span>
                                <span className="sm:hidden">→</span>
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
