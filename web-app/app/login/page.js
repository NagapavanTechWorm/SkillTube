"use client";

import { signIn, useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
    const { status } = useSession();
    const router = useRouter();
    const searchParams = useSearchParams();

    const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

    useEffect(() => {
        if (status === "authenticated") {
            router.replace(callbackUrl);
        }
    }, [status, router, callbackUrl]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-6">
            <div className="w-full max-w-md rounded-xl border border-white/15 bg-white/5 p-8">
                <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                    Login
                </h1>
                <p className="mt-2 text-sm text-zinc-300">
                    Sign in with Google to continue.
                </p>

                <button
                    onClick={() => signIn("google", { callbackUrl })}
                    className="mt-6 inline-flex h-11 w-full items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
                    type="button"
                >
                    Continue with Google
                </button>

                {status === "loading" && (
                    <p className="mt-4 text-xs text-zinc-400">Checking session...</p>
                )}
            </div>
        </div>
    );
}
