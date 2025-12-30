import { Octokit } from "octokit";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export const getGithubToken = async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized");
  }

  const account = await prisma.account.findFirst({
    where: {
      userId: session.user.id,
      providerId: "github",
    },
  });

  if (!account?.accessToken) {
    throw new Error("No GitHub access token found");
  }

  return account.accessToken;
};

export async function fetchUserContributions(token: string, username: string) {
  const octokit = new Octokit({
    auth: token,
  });

  const query = `
        query($username: String!) {
            user(login: $username) {
                contributionsCollection {
                    contributionCalendar {
                        totalContributions
                        weeks {
                            contributionDays {
                                contributionCount
                                date
                                color
                            }
                        }
                    }
                }
            }
        }
    `;

  try {
    const response: any = await octokit.graphql(query, { username });
    return response.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    console.error("Error fetching user contributions:", error);
    return null;
  }
}

export const getRepositories = async (
  page: number = 1,
  perPage: number = 10
) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.listForAuthenticatedUser({
    sort: "updated",
    direction: "desc",
    visibility: "all",
    per_page: perPage,
    page,
  });

  return data;
};

export const createWebhook = async (owner: string, repo: string) => {
  const token = await getGithubToken();
  const octokit = new Octokit({ auth: token });

  const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/github`;

  const { data: hooks } = await octokit.rest.repos.listWebhooks({
    owner,
    repo,
    name: "web",
    hook_id: 1,
  });

  const existingHook = hooks.find((hook) => hook.config.url === webhookUrl);

  if (existingHook) {
    return existingHook;
  }
  const { data } = await octokit.rest.repos.createWebhook({
    owner,
    repo,
    config: {
      url: webhookUrl,
      content_type: "json",
    },
    events: ["pull_request"],
  });

  return data;
};

export const deleteWebhook = async (owner: string, repo: string) => {
  try {
    const token = await getGithubToken();
    const octokit = new Octokit({ auth: token });

    const webhookUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/github`;

    const { data: hooks } = await octokit.rest.repos.listWebhooks({
      owner,
      repo,
    });

    const hookToDelete = hooks.find((hook) => hook.config.url === webhookUrl);

    if (!hookToDelete) {
      return false;
    }

    await octokit.rest.repos.deleteWebhook({
      owner,
      repo,
      hook_id: hookToDelete.id,
    });
    return true;
  } catch (error) {
    console.log("[DELETE_WEBHOOK_ERROR]", error);
    return false;
  }
};

export const getConnectedRepos = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repos = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
        name: true,
        fullName: true,
        url: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return repos;
  } catch (error) {
    console.error("Error fetching connected repositories:", error);
    return [];
  }
};

export const disconnectRepo = async (repoId: string) => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repo = await prisma.repository.findUnique({
      where: {
        id: repoId,
        userId: session.user.id,
      },
    });

    if (!repo) {
      throw new Error("Repository not found");
    }

    await deleteWebhook(repo.owner, repo.name);

    await prisma.repository.delete({
      where: {
        id: repoId,
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting repository:", error);
    return { success: false, error: (error as Error).message };
  }
};

export const disconnectAllRepos = async () => {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const repos = await prisma.repository.findMany({
      where: {
        userId: session.user.id,
      },
    });

    await Promise.all(
      repos.map((repo) => deleteWebhook(repo.owner, repo.name))
    );

    await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/settings", "page");
    revalidatePath("/dashboard/repository", "page");

    return { success: true };
  } catch (error) {
    console.error("Error disconnecting all repositories:", error);
    return { success: false, error: (error as Error).message };
  }
}