import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import AssessmentDetail from "@/components/dashboard/AssessmentDetail";

export default async function AssessmentPage({ params }) {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/dashboard");
    }

    const { id } = await params;

    return <AssessmentDetail assessmentId={id} />;
}
