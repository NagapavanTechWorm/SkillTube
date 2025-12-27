import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const assessments = await prisma.assessment.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                questions: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 10,
        });

        const serializedAssessments = assessments.map((assessment) => ({
            ...assessment,
            createdAt: assessment.createdAt.toISOString(),
            updatedAt: assessment.updatedAt.toISOString(),
            questions: assessment.questions.map((q) => ({
                ...q,
                createdAt: q.createdAt.toISOString(),
            })),
        }));

        return NextResponse.json({
            success: true,
            assessments: serializedAssessments,
        });
    } catch (error) {
        console.error("Error fetching assessments:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
