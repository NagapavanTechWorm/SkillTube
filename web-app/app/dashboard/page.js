import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import SignOutButton from "@/components/dashboard/SignOutButton";
import UrlComposer from "@/components/dashboard/UrlComposer";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="flex min-h-screen">
                <aside className="hidden w-72 shrink-0 flex-col border-r border-white/10 bg-black md:flex">
                    <div className="flex items-center justify-between gap-3 px-4 py-4">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white">
                                ST
                            </span>
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
                            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-3 text-sm font-medium text-zinc-100 hover:bg-white/10"
                        >
                            New assessment
                        </button>
                    </div>

                    <div className="mt-6 px-4">
                        <div className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                            Recent
                        </div>
                        <div className="mt-3 space-y-2">
                            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
                                React basics (demo)
                            </div>
                            <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-zinc-200">
                                SQL joins (demo)
                            </div>
                        </div>
                    </div>

                    <div className="mt-auto border-t border-white/10 px-4 py-4">
                        <div className="text-sm font-medium text-zinc-100">
                            {session.user?.name || "(no name)"}
                        </div>
                        <div className="text-xs text-zinc-500">{session.user?.email || "(no email)"}</div>
                    </div>
                </aside>

                <main className="flex min-h-screen flex-1 flex-col">
                    <div className="flex items-center justify-between gap-3 border-b border-white/10 px-4 py-4 md:hidden">
                        <div className="flex items-center gap-2">
                            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white">
                                ST
                            </span>
                            <div className="text-sm font-semibold text-zinc-100">SkillTube</div>
                        </div>
                        <SignOutButton />
                    </div>

                    <div className="flex flex-1 items-center justify-center">
                        <UrlComposer />
                    </div>

                    <div className="border-t border-white/10 px-4 py-4">
                        <div className="mx-auto w-full max-w-2xl text-center text-xs text-zinc-500">
                            Paste a YouTube link to generate MCQs (UI only for now).
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
