import { betterAuth } from "better-auth";
import { polar, checkout, portal, usage, webhooks } from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";
import { polarClient } from "@/module/payments/config/polar";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),

    socialProviders: {
        github: {
            clientId: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            scope: ["repo"],
        },
    },
    plugins: [
    polar({
        client: polarClient,
        createCustomerOnSignUp: true,
        use: [
            checkout({
                products: [
                    {
                        productId: "604b5229-573d-4075-9438-ebb254ce8424",
                        slug: "codepur"
                    }
                ],
                successUrl: process.env.POLAR_SUCCESS_URL!,
                authenticatedUsersOnly: true
            }),
            portal({
                returnUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
            }),
            usage(),
            webhooks({
                
            })
        ]
    })
    ]
});