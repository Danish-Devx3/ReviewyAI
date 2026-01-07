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

export const getUserLimit = async (userId: string): Promise<SubscriptionTier> => {
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

export const getUserUsage = async (userId: string): Promise<UserLimit> => {
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

export const canAddRepository = async (userId: string): Promise<boolean> => {
    const tier = await getUserLimit(userId);

    if (tier === "PRO") {
        return true;
    }

    const usage = await getUserUsage(userId);

    return usage.repositoryCount < TIER_LIMITS[tier].repositories;
}