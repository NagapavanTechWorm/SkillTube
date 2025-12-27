"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    useEffect(() => {
        if (status === "authenticated") {
            router.replace(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    const handleSignIn = async () => {
        setIsLoading(true);
        await signIn("google", { callbackUrl });
    };

    return (
        <div className="flex min-h-screen bg-black">
            <div className="hidden lg:flex lg:w-1/2 lg:flex-col lg:justify-center lg:px-16 xl:px-24">
                <div className="max-w-xl">
                    <div className="mb-8 flex items-center gap-3">
                        <img src="/logo.png" alt="SkillTube" className="h-12 w-16 rounded-lg" />
                        <div>
                            <div className="text-xl font-semibold text-zinc-100">SkillTube</div>
                            <div className="text-sm text-zinc-500">AI Assessments</div>
                        </div>
                    </div>

                    <h1 className="text-4xl font-bold tracking-tight text-zinc-100">
                        AI-Powered Skill Assessments
                    </h1>
                    <p className="mt-4 text-base text-zinc-400">
                        Transform YouTube videos into interactive quizzes and track your learning progress.
                    </p>

                    <div className="mt-10 space-y-4">
                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                                <svg className="h-4 w-4 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-300">Instant AI-generated quizzes</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                                <svg className="h-4 w-4 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-300">Track progress and scores</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-white/15 bg-white/5">
                                <svg className="h-4 w-4 text-zinc-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <span className="text-sm text-zinc-300">Validate your knowledge</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex w-full items-center justify-center px-4 py-12 lg:w-1/2 lg:border-l lg:border-white/10">
                <div className="w-full max-w-md">
                    <div className="mb-8 flex flex-col items-center lg:items-start">
                        <div className="mb-6 flex items-center gap-3 lg:hidden">
                            <img src="/logo.png" alt="SkillTube" className="h-12 w-16 rounded-lg" />
                            <div>
                                <div className="text-lg font-semibold text-zinc-100">SkillTube</div>
                                <div className="text-xs text-zinc-500">AI Assessments</div>
                            </div>
                        </div>
                        <h2 className="text-2xl font-semibold text-zinc-100">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-sm text-zinc-400">
                            Sign in to access your dashboard
                        </p>
                    </div>

                    <div className="rounded-xl border border-white/15 bg-white/5 p-6 sm:p-8">
                        <button
                            onClick={handleSignIn}
                            disabled={isLoading || status === "loading"}
                            className="flex h-11 w-full items-center justify-center gap-3 rounded-lg border border-white/15 bg-white px-4 text-sm font-medium text-black transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-60"
                            type="button"
                        >
                            {isLoading || status === "loading" ? (
                                <>
                                    <svg className="h-4 w-4 animate-spin text-black" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <span>Signing in...</span>
                                </>
                            ) : (
                                <>
                                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                                    </svg>
                                    <span>Continue with Google</span>
                                </>
                            )}
                        </button>

                        <div className="relative my-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-white/10"></div>
                            </div>
                            <div className="relative flex justify-center text-xs">
                                <span className="bg-white/5 px-2 text-zinc-500">Secure authentication</span>
                            </div>
                        </div>

                        <div className="rounded-lg border border-white/10 bg-white/5 p-4">
                            <div className="flex items-start gap-3">
                                <svg className="mt-0.5 h-5 w-5 shrink-0 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-xs text-zinc-400">
                                    We use Google authentication to keep your account secure and make sign-in quick and easy.
                                </p>
                            </div>
                        </div>
                    </div>

                    <p className="mt-6 text-center text-xs text-zinc-500">
                        By continuing, you agree to our{" "}
                        <a href="#" className="text-zinc-400 underline hover:text-zinc-300">Terms</a>
                        {" "}and{" "}
                        <a href="#" className="text-zinc-400 underline hover:text-zinc-300">Privacy Policy</a>
                    </p>
                </div>
            </div>
        </div>
    );
}
