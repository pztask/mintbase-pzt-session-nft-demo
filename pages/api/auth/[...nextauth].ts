import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth";
import prisma from "../../../prisma/client";

import { checkPass } from "../../../utils/password-hash";

export async function checkCredentials(credentials: any) {
  // Add logic here to look up the user from the credentials supplied
  if (credentials) {
    const user = await prisma.user
      .findUnique({
        where: { email: credentials.email },
      })
      .catch((e) => {
        return null;
      });

    if (user) {
      // Any object returned will be saved in `user` property of the JWT
      const hasCorrectPassword = await checkPass(
        credentials.password,
        user.encrypted_password
      );

      if (hasCorrectPassword) {
        // FIXME: https://github.com/nextauthjs/next-auth/issues/2709
        return { id: user.id, email: user.email } as any;
      }
    }
  }
  return null;
}

export const authOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "john.doe@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        return await checkCredentials(credentials);
      },
    }),
  ],
  callbacks: {
    async session({ session, token, user }: any) {
      // Send properties to the client, like an access_token and user id from a provider.
      session.user.id = token.sub;

      return session;
    },
  },
};

export default NextAuth(authOptions);
