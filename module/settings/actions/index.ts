"use server";

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { deleteWebhook } from "@/module/github/lib/github";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getUserProfile() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user?.email) {
      throw new Error("Unauthorized");
    }
    const user = await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        createdAt: true,
      },
    });
    return user;
  } catch (error) {
    console.log("[GET_USER_PROFILE_ERROR]", error);
    return null;
  }
}

export async function updateUserProfile(data: { name: string; email: string }) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });
    if (!session?.user) {
      throw new Error("Unauthorized");
    }

    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        name: data.name,
        email: data.email,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });

    revalidatePath("/dashboard/setting", "page");

    return {
      success: true,
      user: updatedUser,
    };
  } catch (error) {
    console.log("[UPDATE_USER_PROFILE_ERROR]", error);
    return {
      success: false,
      error: error,
    };
  }
}

export async function getConnectedRepos() {
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
    console.log("Error in get connected repo", error);
    return [];
  }
}

export async function disconnectRepository(repoId: string) {
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

    revalidatePath("/dashboard/setting", "page");
    revalidatePath("/dashboard/repository", "page");

    return {
      success: true,
    };
  } catch (error) {
    console.error("Error in disconnect repository", error);
    return {
      success: false,
      error: "Failed to disconnect repository",
    };
  }
}

export async function disconnectAllRepos() {
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
      repos.map(async (repo) => {
        await deleteWebhook(repo.owner, repo.name);
      })
    );

    await prisma.repository.deleteMany({
      where: {
        userId: session.user.id,
      },
    });

    revalidatePath("/dashboard/setting", "page");
    revalidatePath("/dashboard/repository", "page");

    return {
      success: true,
      count: repos.length,
    };
  } catch (error) {
    console.error("Error in disconnect all repository", error);
    return {
      success: false,
      error: "Failed to disconnect all repository",
    };
  }
}
