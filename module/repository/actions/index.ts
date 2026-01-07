"use server";
import { inngest } from "@/inngest/client";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { createWebhook, getRepositories } from "@/module/github/lib/github";
import { canAddRepository, incrementRepoCount } from "@/module/payments/lib/subscription";
import { headers } from "next/headers";

export const fetchRepositories = async (page: number, perPage: number) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) {
    throw new Error("Unauthorized");
  }

  const githubRepos = await getRepositories(page, perPage);

  const dbRepos = await prisma.repository.findMany({
    where: {
      userId: session.user.id,
    },
  });

  const connectedRepoIds = new Set(dbRepos.map((repo) => repo.githubId));

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return githubRepos.map((repo: any) => ({
    ...repo,
    isConnected: connectedRepoIds.has(BigInt(repo.id)),
  }));
};


export const connectRepo = async (owner: string, repo: string, githubId: string) => {
  const session = await auth.api.getSession({
    headers: await headers(),
  })

  if (!session) {
    throw new Error("Unauthorized")
  }

  const canAddRepo = await canAddRepository(session.user.id);

  if (!canAddRepo) {
    throw new Error("You have reached the limit of repositories for your plan. Please upgrade your plan to add more repositories.")
  }

  const webhook = await createWebhook(owner, repo)

  if (webhook) {
    await prisma.repository.create({
      data: {
        githubId: BigInt(githubId),
        name: repo,
        owner,
        fullName: `${owner}/${repo}`,
        url: `https://github.com/${owner}/${repo}`,
        userId: session.user.id,
      },
    })
    await incrementRepoCount(session.user.id)
    // triger repo indexing for rag (fire forget)
    try {
      await inngest.send({
        name: "repo.connected",
        data: {
          owner,
          repo,
          userId: session.user.id
        }
      })
    } catch (error) {
      console.error("Error indexing repository:", error)
    }
  }

  return webhook
}