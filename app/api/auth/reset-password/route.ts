import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

export async function POST(request: Request) {
  try {
    const { token, password } = await request.json();

    // 查找具有匹配重置令牌且未过期的用户
    const user = await prisma.user.findFirst({
      where: {
        resetToken: token,
        resetTokenExpiry: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "重置链接无效或已过期" },
        { status: 400 }
      );
    }

    // 更新用户密码并清除重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordHash: hashPassword(password),
        resetToken: null,
        resetTokenExpiry: null,
      },
    });

    return NextResponse.json({
      message: "密码已成功重置",
    });
  } catch (error) {
    console.error("重置密码失败:", error);
    return NextResponse.json(
      { error: "重置密码失败" },
      { status: 500 }
    );
  }
} 