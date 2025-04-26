import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateToken } from "@/lib/token";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    // 查找用户
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "该邮箱未注册" },
        { status: 404 }
      );
    }

    // 生成重置令牌
    const resetToken = generateToken();
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1小时后过期

    // 更新用户的重置令牌
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpiry,
      },
    });

    // 发送重置密码邮件
    const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;
    await sendEmail({
      to: email,
      subject: "重置密码",
      html: `
        <p>您好，</p>
        <p>我们收到了您重置密码的请求。请点击下面的链接重置您的密码：</p>
        <p><a href="${resetUrl}">${resetUrl}</a></p>
        <p>如果您没有请求重置密码，请忽略此邮件。</p>
        <p>此链接将在1小时后过期。</p>
      `,
    });

    return NextResponse.json({
      message: "重置密码的链接已发送到您的邮箱",
    });
  } catch (error) {
    console.error("密码重置请求失败:", error);
    return NextResponse.json(
      { error: "发送重置密码邮件失败" },
      { status: 500 }
    );
  }
} 