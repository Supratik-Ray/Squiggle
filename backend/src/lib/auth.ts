import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const client = new MongoClient(process.env.MONGO_URI!);
await client.connect();
const db = client.db();

export const auth = betterAuth({
  database: mongodbAdapter(db, { client }),

  secret: process.env.BETTER_AUTH_SECRET,

  baseURL: "https://squiggle.onrender.com",

  trustedOrigins: [
    "https://squiggle-mauve.vercel.app",
    "http://localhost:5173",
    "http://localhost:5174",
  ],

  advanced: {
    defaultCookieAttributes: {
      secure: true,
      sameSite: "none",
      httpOnly: true,
    },
  },

  emailAndPassword: {
    enabled: true,
  },

  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
});
