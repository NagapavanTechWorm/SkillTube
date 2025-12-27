"use client";

import { useState } from "react";
import UrlComposer from "./UrlComposer";
import AssessmentList from "./AssessmentList";
import SignOutButton from "./SignOutButton";

export default function DashboardContent({ session }) {
    const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);
    const [showNewAssessment, setShowNewAssessment] = useState(true);

    const handleAssessmentClick = (assessmentId) => {
        setSelectedAssessmentId(assessmentId);
        setShowNewAssessment(false);
    };

    const handleNewAssessment = () => {
        setSelectedAssessmentId(null);
        setShowNewAssessment(true);
    };

    return (
        <>
            <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-black md:flex overflow-hidden">
                <div className="flex items-center justify-between gap-3 px-4 py-4">
                    <div className="flex items-center gap-2">
                        <img src="/logo.png" alt="SkillTube" className="h-9 w-12 rounded-lg" />
                        <div className="leading-tight">
                            <div className="text-sm font-semibold text-zinc-100">SkillTube</div>
                            <div className="text-xs text-zinc-500">AI Assessments</div>
                        </div>
                    </div>
                    <SignOutButton />
                </div>

                <div className="px-4">
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
                    <div className="text-sm font-medium text-zinc-100">
                        {session?.user?.name || "(no name)"}
                    </div>
                    <div className="text-xs text-zinc-500">{session?.user?.email || "(no email)"}</div>
                </div>
            </aside>

            <main className="flex h-screen flex-1 flex-col overflow-y-auto">
                <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:hidden">
                    <div className="flex items-center gap-2">
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
