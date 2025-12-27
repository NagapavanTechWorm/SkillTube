"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AssessmentDetail({ assessmentId }) {
    const router = useRouter();
    const [assessment, setAssessment] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isVideoOpen, setIsVideoOpen] = useState(false);

    useEffect(() => {
        loadAssessment();
    }, [assessmentId]);

    const loadAssessment = async () => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await fetch(`/api/assessments/${assessmentId}`);
            const data = await response.json();

            if (data.success) {
                setAssessment(data.assessment);
            } else {
                setError(data.error || 'Failed to load assessment');
            }
        } catch (err) {
            console.error('Error loading assessment:', err);
            setError('Failed to load assessment. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const extractVideoId = (url) => {
        if (!url) return null;
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    if (isLoading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-red-600 border-t-transparent"></div>
                    <div className="text-sm text-zinc-400">Loading assessment...</div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-black">
                <div className="text-center">
                    <div className="mb-4 text-red-400">{error}</div>
                    <Link
                        href="/dashboard"
                        className="text-sm text-zinc-400 hover:text-zinc-200"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    if (!assessment) {
        return null;
    }

    const totalQuestions = assessment.questions?.length || 0;
    const score = assessment.score || 0;
    const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
    const correctAnswers = assessment.questions?.filter((q) => q.isCorrect).length || 0;
    const incorrectAnswers = totalQuestions - correctAnswers;

    const getPerformanceLevel = () => {
        if (percentage >= 90) return { label: 'Excellent', color: 'text-green-400', bg: 'bg-green-500/20' };
        if (percentage >= 75) return { label: 'Good', color: 'text-blue-400', bg: 'bg-blue-500/20' };
        if (percentage >= 60) return { label: 'Average', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
        return { label: 'Needs Improvement', color: 'text-red-400', bg: 'bg-red-500/20' };
    };

    const performance = getPerformanceLevel();
    const videoId = extractVideoId(assessment.youtubeUrl);

    return (
        <div className="min-h-screen bg-black">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 py-4 sm:py-8">
                <div className="mb-4 sm:mb-6">
                    <Link
                        href="/dashboard"
                        className="inline-flex items-center gap-2 text-xs sm:text-sm text-zinc-400 hover:text-zinc-200"
                    >
                        ← Back to Dashboard
                    </Link>
                </div>

                {videoId && (
                    <div className="mb-6 sm:mb-8 rounded-xl border border-white/10 bg-white/5 overflow-hidden">
                        <button
                            onClick={() => setIsVideoOpen(!isVideoOpen)}
                            className="flex w-full items-center justify-between p-3 sm:p-4 text-left hover:bg-white/5 transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                </svg>
                                <h2 className="text-sm sm:text-base font-medium text-zinc-100">Video Source</h2>
                            </div>
                            <svg
                                className={`h-5 w-5 text-zinc-400 transition-transform duration-200 ${isVideoOpen ? 'rotate-180' : ''}`}
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        {isVideoOpen && (
                            <div className="border-t border-white/10 p-3 sm:p-4">
                                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                                    <iframe
                                        src={`https://www.youtube.com/embed/${videoId}`}
                                        title="YouTube video player"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                        allowFullScreen
                                        className="absolute inset-0 h-full w-full"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {assessment.isCompleted ? (
                    <>
                        <div className="mb-6 sm:mb-8 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02] p-4 sm:p-6 md:p-8">
                            <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-0">
                                <div>
                                    <h1 className="text-2xl sm:text-3xl font-bold text-zinc-50">Assessment Results</h1>
                                    <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                                        Completed on {new Date(assessment.completedAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                                <div className={`rounded-full px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-medium ${performance.bg} ${performance.color}`}>
                                    {performance.label}
                                </div>
                            </div>

                            <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-2 md:grid-cols-4">
                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm font-medium text-zinc-400">Score</div>
                                    <div className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-50">
                                        {score}/{totalQuestions}
                                    </div>
                                    <div className="mt-1 text-xs text-zinc-500">{percentage}%</div>
                                </div>

                                <div className="rounded-xl border border-green-500/20 bg-green-500/10 p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm font-medium text-green-400">Correct</div>
                                    <div className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-green-400">{correctAnswers}</div>
                                    <div className="mt-1 text-xs text-green-500/70">
                                        {totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0}%
                                    </div>
                                </div>

                                <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm font-medium text-red-400">Incorrect</div>
                                    <div className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-red-400">{incorrectAnswers}</div>
                                    <div className="mt-1 text-xs text-red-500/70">
                                        {totalQuestions > 0 ? Math.round((incorrectAnswers / totalQuestions) * 100) : 0}%
                                    </div>
                                </div>

                                <div className="rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
                                    <div className="text-xs sm:text-sm font-medium text-zinc-400">Total</div>
                                    <div className="mt-2 text-2xl sm:text-3xl md:text-4xl font-bold text-zinc-50">{totalQuestions}</div>
                                    <div className="mt-1 text-xs text-zinc-500">Questions answered</div>
                                </div>
                            </div>

                            <div className="mt-4 sm:mt-6 rounded-xl border border-white/10 bg-white/5 p-4 sm:p-6">
                                <div className="mb-4 text-xs sm:text-sm font-medium text-zinc-400">Performance Breakdown</div>
                                <div className="relative h-4 overflow-hidden rounded-full bg-white/5">
                                    <div
                                        className="h-full bg-gradient-to-r from-green-500 to-green-400 transition-all duration-500"
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                                <div className="mt-4 flex items-center justify-between text-xs">
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-green-500"></div>
                                        <span className="text-zinc-400">Correct: {correctAnswers}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <div className="h-3 w-3 rounded-full bg-red-500"></div>
                                        <span className="text-zinc-400">Incorrect: {incorrectAnswers}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-4 sm:mb-6">
                            <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Question Review</h2>
                            <p className="mt-1 text-xs sm:text-sm text-zinc-400">
                                Review your answers and learn from explanations
                            </p>
                        </div>

                        <div className="space-y-4 sm:space-y-6">
                            {assessment.questions.map((question, index) => (
                                <div
                                    key={question.questionId}
                                    className="rounded-2xl border border-white/10 bg-white/5 p-4 sm:p-6"
                                >
                                    <div className="mb-4 flex items-start justify-between gap-2">
                                        <div className="flex-1">
                                            <span className="text-xs font-medium text-zinc-500">
                                                Q {index + 1}/{totalQuestions}
                                            </span>
                                            <h3 className="mt-2 text-base sm:text-lg font-medium text-zinc-100">
                                                {question.question}
                                            </h3>
                                        </div>
                                        <div
                                            className={`shrink-0 rounded-full px-2.5 sm:px-3 py-1 text-xs font-medium ${question.isCorrect
                                                ? 'bg-green-500/20 text-green-400'
                                                : 'bg-red-500/20 text-red-400'
                                                }`}
                                        >
                                            <span className="hidden sm:inline">{question.isCorrect ? '✓ Correct' : '✗ Incorrect'}</span>
                                            <span className="sm:hidden">{question.isCorrect ? '✓' : '✗'}</span>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        {question.options?.map((option) => {
                                            const isUserAnswer = option.option === question.userAnswer;
                                            const isCorrectAnswer = option.option === question.correctAnswer;

                                            let borderClass = 'border-white/10 bg-white/5';
                                            let badgeClass = 'bg-white/10 text-zinc-300';

                                            if (isCorrectAnswer) {
                                                borderClass = 'border-green-500/30 bg-green-500/10';
                                                badgeClass = 'bg-green-600 text-white';
                                            } else if (isUserAnswer && !isCorrectAnswer) {
                                                borderClass = 'border-red-500/30 bg-red-500/10';
                                                badgeClass = 'bg-red-600 text-white';
                                            }

                                            return (
                                                <div
                                                    key={option.id}
                                                    className={`rounded-xl border p-3 sm:p-4 ${borderClass}`}
                                                >
                                                    <div className="flex items-start gap-2 sm:gap-3">
                                                        <span
                                                            className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-medium ${badgeClass}`}
                                                        >
                                                            {option.option}
                                                        </span>
                                                        <div className="flex-1">
                                                            <span className="text-xs sm:text-sm text-zinc-200">
                                                                {option.text}
                                                            </span>
                                                            {isUserAnswer && !isCorrectAnswer && (
                                                                <div className="mt-1 text-xs text-red-400">
                                                                    Your answer
                                                                </div>
                                                            )}
                                                            {isCorrectAnswer && (
                                                                <div className="mt-1 text-xs text-green-400">
                                                                    Correct answer
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>

                                    {question.explanation && (
                                        <div className="mt-4 rounded-xl border border-blue-500/20 bg-blue-500/10 p-3 sm:p-4">
                                            <div className="text-xs font-medium text-blue-300">
                                                Explanation
                                            </div>
                                            <div className="mt-1 text-xs sm:text-sm text-blue-200">
                                                {question.explanation}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-6 sm:p-8 text-center">
                        <div className="mx-auto mb-4 inline-flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-yellow-500/20">
                            <svg className="h-7 w-7 sm:h-8 sm:w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-zinc-50">Assessment Not Completed</h2>
                        <p className="mt-2 text-xs sm:text-sm text-zinc-400">
                            This assessment hasn't been completed yet. Start the quiz to see your results.
                        </p>
                        <button
                            onClick={() => router.push('/dashboard')}
                            className="mt-6 rounded-xl bg-red-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-medium text-white hover:bg-red-700"
                        >
                            Go to Dashboard
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
