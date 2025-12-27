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

        const { youtubeUrl, numQuestions = 10 } = await request.json();

        if (!youtubeUrl) {
            return NextResponse.json(
                { success: false, error: "YouTube URL is required" },
                { status: 400 }
            );
        }

        const aiApiUrl = process.env.AI_API_URL || "http://localhost:5000";
        const response = await fetch(`${aiApiUrl}/generate-mcqs`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                youtube_url: youtubeUrl,
                num_questions: numQuestions,
            }),
        });

        if (!response.ok) {
            throw new Error(`AI API returned status ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            return NextResponse.json(
                { success: false, error: "Failed to generate MCQs" },
                { status: 500 }
            );
        }

        const assessment = await prisma.assessment.create({
            data: {
                userId: session.user.id,
                youtubeUrl: youtubeUrl,
                model: data.model,
                questions: {
                    create: data.data.questions.map((q) => ({
                        question: q.question,
                        correctAnswer: q.correct_answer,
                        explanation: q.explanation,
                        options: {
                            create: q.options.map((opt) => ({
                                option: opt.option,
                                text: opt.text,
                            })),
                        },
                    })),
                },
            },
            include: {
                questions: {
                    include: {
                        options: true,
                    },
                },
            },
        });

        const sanitizedAssessment = {
            id: assessment.id,
            youtubeUrl: assessment.youtubeUrl,
            model: assessment.model,
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
    } catch (error) {
        console.error("Error generating MCQs:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
