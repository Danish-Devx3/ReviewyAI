"use server"

import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function getUserProfile(){
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        });
        if(!session?.user?.email){
            throw new Error("Unauthorized")
        }
        const user = await prisma.user.findUnique({
            where: {
                id: session.user.id
            },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                createdAt: true
            }
        })
        return user;
    } catch (error) {
        console.log("[GET_USER_PROFILE_ERROR]", error);
        return null;
    }
}

export async function updateUserProfile(data: {name: string; email: string;}){
    try {
        const session = await auth.api.getSession({
            headers: await headers()
        })
        if(!session?.user){
            throw new Error("Unauthorized")
        }

        const updatedUser = await prisma.user.update({
            where: {
                id: session.user.id
            },
            data: {
                name: data.name,
                email: data.email
            },
            select: {
                id: true,
                name: true,
                email: true,
            }
        })

        revalidatePath("/dashboard/setting", "page");

        return {
            success: true,
            user: updatedUser
        }

    } catch (error) {
        console.log("[UPDATE_USER_PROFILE_ERROR]", error);
        return {
            success: false,
            error: error
        };
    }
}