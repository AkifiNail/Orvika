import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";

// Force l'import depuis le chemin généré
const { PrismaClient } = require("../app/generated/prisma");
const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql", 
  }),
  emailAndPassword: { enabled: true }, 
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  }
});