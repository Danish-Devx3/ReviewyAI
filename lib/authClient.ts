import { polarClient } from "@polar-sh/better-auth/client"
import { createAuthClient } from "better-auth/react"

export const { signIn, signUp, signOut, useSession, customer, checkout } = createAuthClient({
   baseURL: process.env.BETTER_AUTH_URL!,
   plugins: [
      polarClient()
   ]
})