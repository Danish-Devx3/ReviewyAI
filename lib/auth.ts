import { betterAuth } from "better-auth";
import {
  polar,
  checkout,
  portal,
  usage,
  webhooks,
} from "@polar-sh/better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
// If your Prisma file is located elsewhere, you can change the path
import prisma from "@/lib/prisma";
import { polarClient } from "@/module/payments/config/polar";
import { updateUserTier, type SubscriptionTier } from "@/module/payments/lib/subscription";

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
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!, "http://localhost:3000"],
  plugins: [
    polar({
      client: polarClient,
      createCustomerOnSignUp: true,
      use: [
        checkout({
          products: [
            {
              productId: "830b3250-1db2-46f7-bbe1-3240a0ee3515",
              slug: "pro",
            },
          ],
          successUrl: process.env.POLAR_SUCCESS_URL || "/dashboard/subscription?success=true",
          authenticatedUsersOnly: true,
        }),
        portal({
          returnUrl: process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000/dashboard",
        }),
        usage(),
        webhooks({
          secret: process.env.POLAR_WEBHOOK_SECRET!,
          onSubscriptionActive: async (payload) => {
            const customer = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customer,
              },
            });

            if (user) {
              await updateUserTier(user.id, "PRO", "ACTIVE");
            }
          },
          onSubscriptionCanceled: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(
                user.id,
                user.subscriptionTier as SubscriptionTier,
                "CANCELLED"
              );
            }
          },
          onSubscriptionRevoked: async (payload) => {
            const customerId = payload.data.customerId;

            const user = await prisma.user.findUnique({
              where: {
                polarCustomerId: customerId,
              },
            });

            if (user) {
              await updateUserTier(user.id, "FREE", "CANCELLED");
            }
          },
          onOrderPaid: async () => { },
          onCustomerCreated: async (payload) => {
            const user = await prisma.user.findUnique({
              where: {
                email: payload.data.email,
              },
            });

            if (user) {
              await prisma.user.update({
                where: {
                  id: user.id,
                },
                data: {
                  polarCustomerId: payload.data.id,
                },
              });
            }
          },
        }),
      ],
    }),
  ],
});
