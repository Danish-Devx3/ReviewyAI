"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"
import { headers } from "next/headers"
import { getRemainingLimits, updateUserTier } from "../lib/subscription"
import { polarClient } from "../config/polar"

export interface SubscriptionData {
    user: {
        id: string
        name: string
        email: string
        subscriptionTier: string
        subscriptionStatus: string | null
        polarCustomerId: string | null
        polarSubscriptionId: string | null
    } | null

    limits: {
        tier: "FREE" | "PRO"
        repositories: {
            current: number;
            limit: number | null; // null for free tier
            isExceeded: boolean;
        }
        reviews: {
            [repositoryId: string]: {
                current: number;
                limit: number | null; // null for free tier
                isExceeded: boolean;
            }
        };
    } | null
}

export async function subscriptionData(): Promise<SubscriptionData> {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        return { user: null, limits: null }
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!user) {
        return { user: null, limits: null }
    }

    const limits = await getRemainingLimits(user.id)

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            subscriptionTier: user.subscriptionTier,
            subscriptionStatus: user.subscriptionStatus,
            polarCustomerId: user.polarCustomerId,
            polarSubscriptionId: user.polarSubscriptionId
        },
        limits
    }
}

export async function syncSubscriptionStatus() {
    const session = await auth.api.getSession({
        headers: await headers()
    })

    if (!session?.user) {
        throw new Error("Unauthorized")
    }

    const user = await prisma.user.findUnique({
        where: {
            id: session.user.id
        }
    })

    if (!user) {
        return { success: false, message: "User not found" }
    }

    try {
        const res = await polarClient.subscriptions.list({
            customerId: user.polarCustomerId
        })

        const subscriptions = res.result.items || []

        const activeSubscription = subscriptions.find((subscription) => subscription.status === "active")

        const latestSubscription = subscriptions[0]

        if (activeSubscription) {
            await updateUserTier(user.id, "PRO", "ACTIVE", activeSubscription.id)
            return { success: true, status: "ACTIVE" }
        } else if (latestSubscription) {
            const status = latestSubscription.status === "canceled" ? "CANCELLED" : "EXPIRED"
            if (latestSubscription.status !== 'active') {
                await updateUserTier(user.id, "FREE", status, latestSubscription.id)
            }
            return { success: true, status }
        }
    } catch (error) {
        console.error("Error syncing subscription status", error)
        return { success: false, message: "Error syncing subscription status" }
    }
}

