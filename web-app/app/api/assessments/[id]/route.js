import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(request, { params }) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { id } = await params;

        const assessment = await prisma.assessment.findUnique({
            where: {
                id: id,
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
                userAnswers: true,
            },
        });

        if (!assessment) {
            return NextResponse.json(
                { success: false, error: "Assessment not found" },
                { status: 404 }
            );
        }

        if (assessment.userId !== session.user.id) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 403 }
            );
        }

        if (assessment.isCompleted) {
            const details = assessment.questions.map((question) => {
                const userAnswer = assessment.userAnswers.find(
                    (ua) => ua.questionId === question.id
                );

                return {
                    questionId: question.id,
                    question: question.question,
                    userAnswer: userAnswer?.selectedAnswer || null,
                    correctAnswer: question.correctAnswer,
                    isCorrect: userAnswer?.isCorrect || false,
                    explanation: question.explanation,
                    options: question.options,
                };
            });

            return NextResponse.json({
                success: true,
                assessment: {
                    id: assessment.id,
                    youtubeUrl: assessment.youtubeUrl,
                    isCompleted: true,
                    score: assessment.score,
                    totalQuestions: assessment.totalQuestions,
                    completedAt: assessment.completedAt,
                    createdAt: assessment.createdAt,
                    questions: details,
                },
            });
        } else {
            const sanitizedAssessment = {
                id: assessment.id,
                youtubeUrl: assessment.youtubeUrl,
                isCompleted: false,
                createdAt: assessment.createdAt,
                questions: assessment.questions.map((q) => ({
                    id: q.id,
                    question: q.question,
                    options: q.options.map((opt) => ({
                        id: opt.id,
                        option: opt.option,
                        text: opt.text,
                    })),
                })),
            };

            return NextResponse.json({
                success: true,
                assessment: sanitizedAssessment,
            });
        }
    } catch (error) {
        console.error("Error fetching assessment:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
