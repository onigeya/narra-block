import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        console.log(credentials)
        if (!credentials?.email) return null;
        return {
          id: "1",
          name: "Admin",
          email: credentials.email as string,
          image: "https://github.com/shadcn.png",
        }
      },
    }),
  ],
})