"use server"

import prisma from "@/lib/prisma"

export async function reviewPR(owner: string, name: string, prNumber: number) {
    const repo = await prisma.repository.findFirst({
        where: {
            owner,
            name
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
        throw new Error(`Repository not found: ${owner}/${name}, Please reconnect the repository.`)
    }

    const token = repo.user.accounts[0].accessToken;

    
}