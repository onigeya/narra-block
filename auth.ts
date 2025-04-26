import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "./lib/db";
import { hashPassword } from "./lib/password";

// 扩展默认类型
declare module "next-auth" {
  interface User {
    roles: string[];
    permissions: string[];
  }
  interface Session {
    user: {
      roles: string[];
      permissions: string[];
      email?: string | null;
      name?: string | null;
      image?: string | null;
    };
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: { label: "邮箱", type: "email" },
        password: { label: "密码", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        if (!email || !password) return null;
        const passwordHash = hashPassword(password);

        // 获取用户及其角色和权限
        const user = await prisma.user.findUnique({
          where: { email, passwordHash },
          include: {
            roles: {
              include: {
                role: {
                  include: {
                    permissions: {
                      include: {
                        permission: true,
                      },
                    },
                  },
                },
              },
            },
          },
        });

        if (!user) return null;

        // 提取角色信息
        const roles = user.roles.map((userRole) => userRole.role.name);

        // 提取并去重权限信息
        const permissions = [
          ...new Set(
            user.roles.flatMap((userRole) =>
              userRole.role.permissions.map(
                (rolePermission) => rolePermission.permission.name
              )
            )
          ),
        ];

        // 返回用户信息，包括角色和权限
        return {
          ...user,
          roles,
          permissions,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // 首次登录时，user会包含authorize函数返回的信息
      if (user) {
        token.roles = user.roles;
        token.permissions = user.permissions;
      }

      return token;
    },
    async session({ session, token }) {
      // 从token中获取角色和权限信息添加到session
      if (token) {
        session.user.roles = token.roles as string[];
        session.user.permissions = token.permissions as string[];
      }
      return session;
    },
  },
});
