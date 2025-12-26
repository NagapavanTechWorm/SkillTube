"use client";

import { useState } from "react";

export default function UrlComposer() {
    const [url, setUrl] = useState("");

    const onSubmit = (e) => {
        e.preventDefault();
        if (!url.trim()) return;
        // Placeholder: later we will call an API to generate MCQs from the URL.
        setUrl("");
    };

    return (
        <div className="mx-auto flex w-full max-w-2xl flex-col items-center justify-center px-6">
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
                    />
                    <button
                        type="submit"
                        className="inline-flex h-11 shrink-0 items-center justify-center rounded-xl bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700"
                    >
                        Generate
                    </button>
                </div>

                <div className="mt-3 text-center text-xs text-zinc-500">
                    Tip: paste any tutorial/lecture link to create a quick quiz.
                </div>
            </form>
        </div>
    );
}
