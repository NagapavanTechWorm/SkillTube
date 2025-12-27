"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AssessmentList({ onRefresh, onAssessmentClick }) {
    const router = useRouter();
    const [assessments, setAssessments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchAssessments = async () => {
        try {
            setIsLoading(true);
            const response = await fetch('/api/assessments');
            const data = await response.json();

            if (data.success) {
                setAssessments(data.assessments);
                setError(null);
            } else {
                setError(data.error);
            }
        } catch (err) {
            console.error('Error fetching assessments:', err);
            setError('Failed to load assessments');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchAssessments();
    }, []);

    useEffect(() => {
        if (onRefresh) {
            window.refreshAssessments = fetchAssessments;
        }
    }, [onRefresh]);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 60) {
            return `${diffMins}m ago`;
        } else if (diffHours < 24) {
            return `${diffHours}h ago`;
        } else if (diffDays < 7) {
            return `${diffDays}d ago`;
        } else {
            return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        }
    };

    const getVideoTitle = (url) => {
        try {
            const urlObj = new URL(url);
            const videoId = urlObj.searchParams.get('v');
            return videoId ? `Video ${videoId.substring(0, 8)}...` : 'YouTube Video';
        } catch {
            return 'YouTube Video';
        }
    };

    return (
        <div className="mt-6 flex flex-col overflow-hidden px-4 py-4">
            <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Recent Assessments
            </div>
            <div className="mt-3 space-y-2 overflow-y-auto pr-2 scrollbar-hide">
                {isLoading ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400">
                        Loading...
                    </div>
                ) : error ? (
                    <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-xs text-red-300">
                        {error}
                    </div>
                ) : assessments.length === 0 ? (
                    <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-zinc-400">
                        No assessments yet
                    </div>
                ) : (
                    assessments.map((assessment) => (
                        <div
                            key={assessment.id}
                            onClick={() => router.push(`/dashboard/${assessment.id}`)}
                            className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 hover:bg-white/10 transition-colors cursor-pointer"
                        >
                            <div className="flex items-start justify-between gap-2">
                                <div className="flex-1 min-w-0">
                                    <div className="text-sm text-zinc-200 truncate">
                                        {getVideoTitle(assessment.youtubeUrl)}
                                    </div>
                                    <div className="mt-1 flex items-center gap-2 text-xs text-zinc-500">
                                        <span>{assessment.questions?.length || 0} questions</span>
                                        <span>•</span>
                                        <span>{formatDate(assessment.createdAt)}</span>
                                        {assessment.isCompleted && (
                                            <>
                                                <span>•</span>
                                                <span className="text-green-400">
                                                    {assessment.score}/{assessment.totalQuestions}
                                                </span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
