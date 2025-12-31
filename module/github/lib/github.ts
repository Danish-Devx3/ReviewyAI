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

export const getRepoFileContents = async (
  token: string,
  owner: string,
  repo: string,
  path: string = ""
): Promise<any> => {
  const octokit = new Octokit({ auth: token });

  const { data } = await octokit.rest.repos.getContent({
    owner,
    repo,
    path,
  });

  if (!Array.isArray(data)) {
    if (data.type === "file") {
      return [
        {
          path: data.path,
          content: Buffer.from(data.content, "base64").toString("utf-8"),
        },
      ];
    }
    return [];
  }

  let files: { path: string; content: string }[] = [];

  for (const file of data) {
    if (file.type === "file") {
      const { data: fileData } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: file.path,
      });

      if (
        !Array.isArray(fileData) &&
        fileData.type === "file" &&
        fileData.content
      ) {
        if (!file.path.match(/\.(png|jpg|jpeg|gif|svg|ico|pdf|zip|tar|gz)$/i)) {
          files.push({
            path: file.path,
            content: Buffer.from(fileData.content, "base64").toString("utf-8"),
          });
        }
      }
    } else if (file.type === "dir") {
      const nestedFiles = await getRepoFileContents(
        token,
        owner,
        repo,
        file.path
      );
      files = files.concat(nestedFiles);
    }
  }
};
