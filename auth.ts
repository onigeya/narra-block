import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { prisma } from "./lib/db";
import { hashPassword } from "./lib/password";


export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string; password: string };
        if (!email || !password) return null;
        const passwordHash = hashPassword(password);
        const user = await prisma.user.findUnique({
          where: { email, passwordHash },
        });
        if (!user) return null;
        return user;
      },
    }),
  ],
});
