import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: "https://squiggle.onrender.com", //backend URL
  fetchOptions: {
    credentials: "include",
  },
});

export const { signIn, signUp, signOut, useSession } = authClient;
