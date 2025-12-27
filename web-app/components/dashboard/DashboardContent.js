"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import UrlComposer from "./UrlComposer";
import AssessmentList from "./AssessmentList";
import SignOutButton from "./SignOutButton";

export default function DashboardContent({ session }) {
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
    const [showNewAssessment, setShowNewAssessment] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const handleAssessmentClick = (assessmentId) => {
        setSelectedAssessmentId(assessmentId);
        setShowNewAssessment(false);
        setIsMobileMenuOpen(false);
    };

    const handleNewAssessment = () => {
        setSelectedAssessmentId(null);
        setShowNewAssessment(true);
        setIsMobileMenuOpen(false);
    };

    return (
        <>
            <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-black md:flex">
                <div className="flex h-full flex-col overflow-hidden">
                    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-4">
                        <img src="/logo.png" alt="SkillTube" className="h-9 w-12 rounded-lg" />
                        <div className="leading-tight">
                            <div className="text-sm font-semibold text-zinc-100">SkillTube</div>
                            <div className="text-xs text-zinc-500">AI Assessments</div>
                        </div>
                    </div>

                    <div className="px-4 py-4">
                        <button
                            type="button"
                            onClick={handleNewAssessment}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10"
                        >
                            + New assessment
                        </button>
                    </div>

                    <AssessmentList
                        onRefresh={true}
                        onAssessmentClick={handleAssessmentClick}
                    />

                    <div className="mt-auto border-t border-white/10 px-4 py-4">
                        <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100">
                                {session?.user?.name || "(no name)"}
                            </div>
                            <div className="text-xs text-zinc-500">{session?.user?.email || "(no email)"}</div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10"
                            type="button"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            <aside className={`fixed inset-y-0 left-0 z-50 w-72 transform border-r border-white/10 bg-black transition-transform duration-300 md:hidden ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                }`}>
                <div className="flex h-full flex-col overflow-hidden">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4">
                        <div className="flex items-center gap-3">
                            <img src="/logo.png" alt="SkillTube" className="h-9 w-12 rounded-lg" />
                            <div className="leading-tight">
                                <div className="text-sm font-semibold text-zinc-100">SkillTube</div>
                                <div className="text-xs text-zinc-500">AI Assessments</div>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-400 hover:bg-white/10"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    <div className="px-4 py-4">
                        <button
                            type="button"
                            onClick={handleNewAssessment}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10"
                        >
                            + New assessment
                        </button>
                    </div>

                    <AssessmentList
                        onRefresh={true}
                        onAssessmentClick={handleAssessmentClick}
                    />

                    <div className="mt-auto border-t border-white/10 px-4 py-4">
                        <div className="mb-3">
                            <div className="text-sm font-medium text-zinc-100">
                                {session?.user?.name || "(no name)"}
                            </div>
                            <div className="text-xs text-zinc-500">{session?.user?.email || "(no email)"}</div>
                        </div>
                        <button
                            onClick={() => signOut({ callbackUrl: "/" })}
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10"
                            type="button"
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </aside>

            <main className="flex h-screen flex-1 flex-col overflow-y-auto">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:hidden">
                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-zinc-100 hover:bg-white/10"
                        >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                        <img src="/logo.png" alt="SkillTube" className="h-9 w-12 rounded-lg" />
                        <div className="text-sm font-semibold text-zinc-100">SkillTube</div>
                    </div>
                    <SignOutButton />
                </div>

                <div className="flex flex-1 items-center justify-center">
                    <UrlComposer
                        selectedAssessmentId={selectedAssessmentId}
                        showNewAssessment={showNewAssessment}
                        onNewAssessment={handleNewAssessment}
                    />
                </div>
            </main>
        </>
    );
}
