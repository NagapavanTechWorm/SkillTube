"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
    return (
        <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-zinc-100 hover:bg-white/10"
            type="button"
        >
            Sign out
        </button>
    );
}
