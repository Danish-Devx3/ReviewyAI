"use server"

import { inngest } from "@/inngest/client";
import prisma from "@/lib/prisma"
import { getPRDiff } from "@/module/github/lib/github";

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

    if (!repo?.user.accounts[0].accessToken){
        throw new Error(`Repository not found: ${owner}/${repoName}, Please reconnect the repository.`)
    }

    const token = repo.user.accounts[0].accessToken;

    await inngest.send({
        name: "pr.review.requested",
        data: {
            owner,
            repoName,
            prNumber,
            userId: repo.userId
        }
    });

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

            if(repo){
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