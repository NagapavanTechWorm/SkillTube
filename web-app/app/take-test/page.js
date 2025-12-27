import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import TakeTestClient from "@/components/take-test/TakeTestClient";

export default async function TakeTestPage() {
    const session = await getServerSession(authOptions);

    if (!session) {
        redirect("/login?callbackUrl=/take-test");
    }

    return <TakeTestClient />;
}
