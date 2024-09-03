import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
        },
        password: {
          type: "password",
        },
      },
      async authorize(credentials, req) {
        const url = new URL(req.url);
        const res = await fetch(`${url.protocol}//${url.host}/api/auth/check`, {
          method: "POST",
          body: JSON.stringify(credentials),
          headers: { "Content-Type": "application/json" },
        });
        const user = await res.json();

        // If no error and we have user data, return it
        if (res.ok && user) {
          return user;
        }
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin", //sigin page
  },
  callbacks: {
    authorized: async ({ auth }) => {
      // Logged in users are authenticated, otherwise redirect to login page
      return !!auth;
    },
  },
});
