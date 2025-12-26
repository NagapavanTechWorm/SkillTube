import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import SignOutButton from "./SignOutButton";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-black px-6">
            <div className="w-full max-w-2xl rounded-xl border border-white/15 bg-white/5 p-8">
                <div className="flex items-center justify-between gap-4">
                    <h1 className="text-2xl font-semibold tracking-tight text-zinc-50">
                        Dashboard
                    </h1>
                    <SignOutButton />
                </div>

                <p className="mt-4 text-sm text-zinc-300">
                    You are logged in.
                </p>

                <div className="mt-6 rounded-lg border border-white/10 bg-black/40 p-4 text-sm text-zinc-200">
                    <div>
                        <span className="font-medium">User:</span> {session.user?.name || "(no name)"}
                    </div>
                    <div className="mt-1">
                        <span className="font-medium">Email:</span> {session.user?.email || "(no email)"}
                    </div>
                </div>
            </div>
        </div>
    );
}
