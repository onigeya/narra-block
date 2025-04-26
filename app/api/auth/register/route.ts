import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    // 检查邮箱是否已注册
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "该邮箱已被注册" },
        { status: 400 }
      );
    }

    // 创建新用户
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash: hashPassword(password),
        // 默认角色为普通用户
        roles: {
          create: {
            role: {
              connect: {
                name: "user"
              }
            }
          }
        }
      },
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      message: "注册成功",
      user: {
        id: user.id,
        email: user.email,
        roles: user.roles.map(r => r.role.name)
      }
    });
  } catch (error) {
    console.error("注册失败:", error);
    return NextResponse.json(
      { error: "注册失败" },
      { status: 500 }
    );
  }
} 