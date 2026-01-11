"use server"

import prisma from "@/lib/prisma";

export type SubscriptionTier = "FREE" | "PRO";
export type SubscriptionStatus = "ACTIVE" | "CANCELLED" | "EXPIRED";

export interface UserLimit {
    tier: SubscriptionTier;
    repositories: {
        current: number;
        limit: number | null; // null for free tier
        isExceeded: boolean;
    };

    reviews: {
        [repositoryId: string]: {
            current: number;
            limit: number | null; // null for free tier
            isExceeded: boolean;
        }
    };
}

const TIER_LIMITS = {
    FREE: {
        repositories: 3,
        reviewsPerRepo: 3
    },

    PRO: {
        repositories: null, // null for pro tier means unlimited
        reviewsPerRepo: null
    }
} as const;

export const getUserTier = async (userId: string): Promise<SubscriptionTier> => {
    const user = await prisma.user.findUnique({
        where: {
            id: userId
        },
        select: {
            subscriptionTier: true
        }
    })

    if (!user) {
        throw new Error("User not found");
    }

    return (user?.subscriptionTier as SubscriptionTier) || "FREE";
}

export const getUserUsage = async (userId: string) => {
    let usage = await prisma.userUsage.findUnique({
        where: {
            userId: userId
        }
    })

    if (!usage) {
        usage = await prisma.userUsage.create({
            data: {
                userId: userId,
                repositoryCount: 0,
                reviewCount: {}
            }
        })
    }

    return usage;
}

export const canAddRepository = async (userId: string) => {
    const tier = await getUserTier(userId);

    if (tier === "PRO") {
        return true;
    }

    const usage = await getUserUsage(userId);

    return usage.repositoryCount < TIER_LIMITS[tier].repositories;
}

export const canGenerateReview = async (userId: string, repositoryId: string) => {
    const tier = await getUserTier(userId);

    if (tier === "PRO") {
        return true;
    }

    const usage = await getUserUsage(userId);

    const reviewCount = usage.reviewCount as Record<string, number>;
    const currentReviewCount = reviewCount[repositoryId] || 0;
    const limit = TIER_LIMITS[tier].reviewsPerRepo;

    return currentReviewCount < limit;
}

export const incrementRepoCount = async (userId: string) => {
    await prisma.userUsage.upsert({
        where: {
            userId
        },
        create: {
            userId,
            repositoryCount: 1,
            reviewCount: {}
        },
        update: {
            repositoryCount: {
                increment: 1
            }
        }
    })
}

export const incrementReviewCount = async (userId: string, repositoryId: string) => {
    await prisma.userUsage.upsert({
        where: {
            userId
        },
        create: {
            userId,
            repositoryCount: 0,
            reviewCount: {
                [repositoryId]: 1
            }
        },
        update: {
            reviewCount: {
                [repositoryId]: {
                    increment: 1
                }
            }
        }
    })
}

export const getRemainingLimits = async (userId: string) => {
    const tier = await getUserTier(userId);
    const usage = await getUserUsage(userId);
    const reviewCount = usage.reviewCount as Record<string, number>;

    const limits: UserLimit = {
        tier,
        repositories: {
            current: usage.repositoryCount,
            limit: tier === "PRO" ? null : TIER_LIMITS[tier].repositories,
            isExceeded: tier === "PRO" ? false : usage.repositoryCount >= TIER_LIMITS[tier].repositories
        },
        reviews: {}
    }

    const repos = await prisma.repository.findMany({
        where: {
            userId
        },
        select: {
            id: true
        }
    })

    for (const repo of repos) {
        const currentCount = reviewCount[repo.id] || 0;
        limits.reviews[repo.id] = {
            current: currentCount,
            limit: tier === "PRO" ? null : TIER_LIMITS[tier].reviewsPerRepo,
            isExceeded: tier === "PRO" ? false : currentCount >= TIER_LIMITS[tier].reviewsPerRepo
        }
    }

    return limits;
}

export const updateUserTier = async (userId: string, tier: SubscriptionTier, status: SubscriptionStatus, subscriptionId?: string) => {
    await prisma.user.update({
        where: {
            id: userId
        },
        data: {
            subscriptionTier: tier,
            subscriptionStatus: status,
            polarSubscriptionId: subscriptionId || null
        }
    })
}