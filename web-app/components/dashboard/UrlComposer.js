"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import QuizInterface from "./QuizInterface";

export default function UrlComposer({ selectedAssessmentId, showNewAssessment, onNewAssessment }) {
    const router = useRouter();
    const { data: session } = useSession();
    const [url, setUrl] = useState("");
    const [status, setStatus] = useState("");
    const [isGenerating, setIsGenerating] = useState(false);
    const [assessment, setAssessment] = useState(null);
    const [error, setError] = useState(null);
    const [showQuiz, setShowQuiz] = useState(false);
    const [isLoadingAssessment, setIsLoadingAssessment] = useState(false);

    useEffect(() => {
        if (selectedAssessmentId) {
            loadAssessment(selectedAssessmentId);
        } else if (showNewAssessment) {
            setAssessment(null);
            setShowQuiz(false);
            setUrl("");
            setStatus("");
            setError(null);
        }
    }, [selectedAssessmentId, showNewAssessment]);

    const loadAssessment = async (assessmentId) => {
        try {
            setIsLoadingAssessment(true);
            setError(null);

            const response = await fetch(`/api/assessments/${assessmentId}`);
            const data = await response.json();

            if (data.success) {
                setAssessment(data.assessment);
                setShowQuiz(true);
            } else {
                setError(data.error || 'Failed to load assessment');
            }
        } catch (err) {
            console.error('Error loading assessment:', err);
            setError('Failed to load assessment. Please try again.');
        } finally {
            setIsLoadingAssessment(false);
        }
    };

    const onSubmit = async (e) => {
        e.preventDefault();

        if (!url.trim()) {
            setError('Please enter a YouTube URL');
            return;
        }

        if (!session?.user?.id) {
            setError('Please sign out and sign in again to refresh your session');
            return;
        }

        router.push(`/take-test?url=${encodeURIComponent(url)}`);
    };

    if (showQuiz && assessment) {
        return (
            <QuizInterface
                assessment={assessment}
                onBack={() => {
                    setShowQuiz(false);
                    setAssessment(null);
                    setUrl("");
                    setStatus("");
                }}
            />
        );
    }

    return (
        <div className="mx-auto flex w-full max-w-4xl flex-col items-center justify-center px-6">
            <h1 className="text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
                Paste a YouTube link
            </h1>
            <p className="mt-3 max-w-xl text-center text-sm leading-6 text-zinc-300">
                SkillTube will generate MCQs from the video so you can test your understanding.
            </p>

            <form onSubmit={onSubmit} className="mt-8 w-full">
                <div className="flex w-full items-center gap-2 rounded-2xl border border-white/15 bg-white/5 p-2 shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
                    <input
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        placeholder="https://www.youtube.com/watch?v=..."
                        type="url"
                        className="h-11 w-full bg-transparent px-4 text-sm text-zinc-100 outline-none placeholder:text-zinc-500"
                        autoComplete="off"
                        disabled={isGenerating}
                    />
                    <button
                        type="submit"
                        disabled={isGenerating}
                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isGenerating ? 'Generating...' : 'Generate'}
                    </button>
                </div>

                <div className="mt-3 text-center text-xs text-zinc-500">
                    <div>Tip: paste any tutorial/lecture link to create a quick quiz.</div>
                    <div className="mt-1 text-zinc-600">Supports only English videos</div>
                </div>
            </form>

            {status && (
                <div className="mt-6 rounded-xl border border-blue-500/20 bg-blue-500/10 px-4 py-3 text-sm text-blue-300">
                    {status}
                </div>
            )}

            {error && (
                <div className="mt-6 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                    {error}
                </div>
            )}
        </div>
    );
}
