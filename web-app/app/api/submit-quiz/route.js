import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request) {
    try {
        const session = await getServerSession(authOptions);

        if (!session || !session.user) {
            return NextResponse.json(
                { success: false, error: "Unauthorized" },
                { status: 401 }
            );
        }

        const { assessmentId, answers } = await request.json();

        if (!assessmentId || !answers) {
            return NextResponse.json(
                { success: false, error: "Assessment ID and answers are required" },
                { status: 400 }
            );
        }

        const assessment = await prisma.assessment.findUnique({
            where: {
                id: assessmentId,
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
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

        let score = 0;
        const details = assessment.questions.map((question, index) => {
            const userAnswer = answers[index];
            const isCorrect = userAnswer === question.correctAnswer;

            if (isCorrect) {
                score++;
            }

            return {
                questionId: question.id,
                question: question.question,
                userAnswer: userAnswer || null,
                correctAnswer: question.correctAnswer,
                isCorrect,
                explanation: question.explanation,
            };
        });

        await prisma.assessment.update({
            where: { id: assessmentId },
            data: {
                isCompleted: true,
                score: score,
                totalQuestions: assessment.questions.length,
                completedAt: new Date(),
                userAnswers: {
                    create: details.map((detail) => ({
                        questionId: detail.questionId,
                        selectedAnswer: detail.userAnswer || '',
                        isCorrect: detail.isCorrect,
                    })),
                },
            },
        });

        return NextResponse.json({
            success: true,
            results: {
                score,
                total: assessment.questions.length,
                details,
            },
        });
    } catch (error) {
        console.error("Error submitting quiz:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
