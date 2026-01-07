"use server"

import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma"
import { canGenerateReview, incrementReviewCount } from "@/module/payments/lib/subscription";

export async function reviewPR(owner: string, repoName: string, prNumber: number) {
    try {

        const repo = await prisma.repository.findFirst({
            where: {
                owner,
                name: repoName
            },
            include: {
                user: {
                    include: {
                        accounts: {
                            where: {
                                providerId: "github"
                            }
                        }
                    }
                }
            }
        });

        if (!repo?.user.accounts[0].accessToken) {
            throw new Error(`Repository not found: ${owner}/${repoName}, Please reconnect the repository.`)
        }

        const canReviewPR = await canGenerateReview(repo.userId, repo.id);

        if (!canReviewPR) {
            throw new Error("You have reached the limit of reviews for your plan. Please upgrade your plan to add more reviews.")
        }

        await inngest.send({
            name: "pr.review.requested",
            data: {
                owner,
                repoName,
                prNumber,
                userId: repo.userId
            }
        });

        await incrementReviewCount(repo.user.id, repo.id)

        return {
            success: true,
            message: "PR review Queued"
        }

    } catch (error) {
        try {
            const repo = await prisma.repository.findFirst({
                where: {
                    owner,
                    name: repoName
                }
            });

            if (repo) {
                await prisma.review.create({
                    data: {
                        repositoryId: repo.id,
                        prNumber,
                        prTitle: "Failed to fetch PR",
                        prBody: "Failed to fetch PR",
                        prUrl: `https://github.com/${owner}/${repoName}/pull/${prNumber}`,
                        review: `Error: ${error instanceof Error ? error.message : error}`,
                        status: "failed"
                    }
                });
            }
        } catch (error) {
            console.error("Failed to create review in db", error)
        }
    }
}