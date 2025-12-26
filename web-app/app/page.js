import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "../lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="min-h-screen bg-black text-zinc-50">
      <header className="sticky top-0 z-20 border-b border-white/10 bg-black/70 backdrop-blur">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-red-600 text-sm font-semibold text-white">
              ST
            </span>
            <span className="text-sm font-semibold tracking-tight">SkillTube</span>
          </Link>

          <nav className="flex items-center gap-2">
            {session ? (
              <Link
                href="/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-lg bg-red-600 px-4 text-sm font-medium text-white hover:bg-red-700"
              >
                Dashboard
              </Link>
            ) : (
              <Link
                href="/login?callbackUrl=/dashboard"
                className="inline-flex h-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-4 text-sm font-medium text-zinc-100 hover:bg-white/10"
              >
                Login
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(80rem_40rem_at_50%_-10%,rgba(220,38,38,0.25),transparent_60%)]" />
          <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 py-16 md:grid-cols-2 md:py-20">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-red-300">
                AI-enabled assessment platform
              </div>
              <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight sm:text-5xl">
                Paste a YouTube link.
                <span className="block text-red-500">Get instant MCQs.</span>
                Practice. Measure. Improve.
              </h1>
              <p className="mt-5 max-w-xl text-base leading-7 text-zinc-300">
                SkillTube turns learning videos into structured assessments—so you can test
                understanding, track progress, and prepare smarter.
              </p>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Go to Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login?callbackUrl=/dashboard"
                    className="inline-flex h-11 items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700"
                  >
                    Login to Start
                  </Link>
                )}
                <a
                  href="#how-it-works"
                  className="inline-flex h-11 items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-medium text-zinc-100 hover:bg-white/10"
                >
                  See how it works
                </a>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-red-600/20 blur-2xl" />
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs font-medium text-red-300">Example assessment</p>
                    <h2 className="mt-1 text-lg font-semibold tracking-tight">Video → MCQ quiz</h2>
                  </div>
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-zinc-100">
                    10 questions
                  </span>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-xl border border-white/10 bg-black/40 p-4">
                    <p className="text-sm font-medium">1) What is the main concept explained?</p>
                    <div className="mt-3 grid gap-2 text-sm text-zinc-200">
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">A) Option A</div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">B) Option B</div>
                      <div className="rounded-lg border border-white/10 bg-white/5 px-3 py-2">C) Option C</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 p-4">
                    <div>
                      <p className="text-xs text-zinc-400">Skill score</p>
                      <p className="text-lg font-semibold text-zinc-50">82%</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-zinc-400">Time</p>
                      <p className="text-lg font-semibold text-zinc-50">4m 12s</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mx-auto w-full max-w-6xl px-6 py-14">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-base font-semibold">AI MCQ generation</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Turn long videos into concise questions focused on key concepts.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-base font-semibold">Skill testing</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Practice under a timer, get instant feedback, and revisit weak areas.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
              <h3 className="text-base font-semibold">Progress tracking</h3>
              <p className="mt-2 text-sm leading-6 text-zinc-300">
                Keep your assessments and sessions in one place and improve consistently.
              </p>
            </div>
          </div>
        </section>

        <section id="how-it-works" className="border-t border-white/10 bg-black">
          <div className="mx-auto w-full max-w-6xl px-6 py-14">
            <h2 className="text-2xl font-semibold tracking-tight">How it works</h2>
            <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-medium text-red-300">Step 1</p>
                <h3 className="mt-2 text-base font-semibold">Paste YouTube link</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Add a video you’re learning from—tutorials, lectures, or interviews.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-medium text-red-300">Step 2</p>
                <h3 className="mt-2 text-base font-semibold">Generate MCQs</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  AI builds a quiz designed to check understanding and retention.
                </p>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/5 p-6">
                <p className="text-xs font-medium text-red-300">Step 3</p>
                <h3 className="mt-2 text-base font-semibold">Take assessment</h3>
                <p className="mt-2 text-sm leading-6 text-zinc-300">
                  Get a score, review mistakes, and keep improving over time.
                </p>
              </div>
            </div>

            <div className="mt-10 flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 p-6 md:flex-row md:items-center">
              <div>
                <h3 className="text-base font-semibold">Ready to test your skills?</h3>
                <p className="mt-1 text-sm text-zinc-300">
                  Login and jump straight into your dashboard.
                </p>
              </div>
              <div className="flex w-full gap-3 md:w-auto">
                {session ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 md:w-auto"
                  >
                    Open Dashboard
                  </Link>
                ) : (
                  <Link
                    href="/login?callbackUrl=/dashboard"
                    className="inline-flex h-11 w-full items-center justify-center rounded-lg bg-red-600 px-5 text-sm font-medium text-white hover:bg-red-700 md:w-auto"
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="inline-flex h-11 w-full items-center justify-center rounded-lg border border-white/15 bg-white/5 px-5 text-sm font-medium text-zinc-100 hover:bg-white/10 md:w-auto"
                >
                  View Dashboard
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-zinc-400">© {new Date().getFullYear()} SkillTube</p>
          <div className="flex gap-4 text-sm">
            <Link className="text-zinc-400 hover:text-red-400" href="/login">
              Login
            </Link>
            <Link className="text-zinc-400 hover:text-red-400" href="/dashboard">
              Dashboard
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
