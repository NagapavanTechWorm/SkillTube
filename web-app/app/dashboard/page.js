import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "../../lib/auth";
import DashboardContent from "@/components/dashboard/DashboardContent";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/dashboard");
    }

    return (
        <div className="min-h-screen bg-black">
            <div className="flex h-screen overflow-hidden">
                <DashboardContent session={session} />
            </div>
        </div>
    );
}
