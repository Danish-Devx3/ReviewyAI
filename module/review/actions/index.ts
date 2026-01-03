"use server"

import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma";
import { headers } from "next/headers"

export async function getReviews() {
    const session = await auth.api.getSession({
        headers: await headers()
    });

    if(!session?.user){
        throw new Error("Unauthorized")
    }

    const review = await prisma.review.findMany({
        where: {
            repository: {
                userId: session.user.id
            }
        },
        include: {
            repository: true
        },
        orderBy:{
            createdAt: "desc"
        },
        take: 50
    })

    return review
}