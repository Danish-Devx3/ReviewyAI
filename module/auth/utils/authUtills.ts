"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export const requireAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (!session?.user) {
        redirect('/login')
    }

    return session.user

}

export const requireNoAuth = async () => {
    const session = await auth.api.getSession({
        headers: await headers(),
    })

    if (session?.user) {
        redirect('/')
    }
}