import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { organization } from "better-auth/plugins"
import { createAuthClient } from "better-auth/react"
const { PrismaClient } = require("../app/generated/prisma")
const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "mysql" }),
  emailAndPassword: { enabled: true },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  // Configuration essentielle manquante
  secret: process.env.BETTER_AUTH_SECRET || process.env.NEXTAUTH_SECRET || "your-secret-key-please-change-in-production",
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
  // Configuration des cookies pour le debug
  advanced: {
    cookiePrefix: "better-auth",
  },
   plugins: [
    organization(), 
  ],
})

// côté client
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000",
})

// ✅ Export explicite pour TypeScript
export const signIn = authClient.signIn
export const signUp = authClient.signUp
export const useSession = authClient.useSession
