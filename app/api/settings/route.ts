import { NextResponse } from "next/server"
import { auth } from "@/auth"
import { prisma } from "@/lib/db"
import { hashPassword } from "@/lib/password"

export async function POST(req: Request) {
  try {
    const session = await auth()
    if (!session?.user) {
      return new NextResponse("未授权", { status: 401 })
    }

    const body = await req.json()
    const { name, currentPassword, newPassword } = body

    // 获取用户信息
    const user = await prisma.user.findUnique({
      where: { email: session.user.email! },
      select: { passwordHash: true },
    })

    if (!user) {
      return new NextResponse("用户不存在", { status: 404 })
    }

    // 准备更新数据
    const updateData: any = { name }

    // 如果提供了新密码，则需要验证当前密码
    if (newPassword) {
      if (!currentPassword) {
        return new NextResponse("请输入当前密码", { status: 400 })
      }

      const isPasswordValid = hashPassword(currentPassword) === user.passwordHash
      if (!isPasswordValid) {
        return new NextResponse("当前密码不正确", { status: 400 })
      }

      updateData.passwordHash = hashPassword(newPassword)
    }

    // 更新用户信息
    await prisma.user.update({
      where: { email: session.user.email! },
      data: updateData,
    })

    return new NextResponse("更新成功", { status: 200 })
  } catch (error) {
    console.error("[SETTINGS_ERROR]", error)
    return new NextResponse("内部错误", { status: 500 })
  }
} 