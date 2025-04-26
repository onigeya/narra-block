import { NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";

// 获取所有用户
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const name = searchParams.get("name") || "";
    const email = searchParams.get("email") || "";

    const where: Prisma.UserWhereInput = {
      ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
      ...(email && { email: { contains: email, mode: Prisma.QueryMode.insensitive } }),
    };

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        include: {
          roles: {
            include: {
              role: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.user.count({ where })
    ]);

    return NextResponse.json({ 
      users,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("获取用户列表失败:", error);
    return NextResponse.json({ error: "获取用户列表失败" }, { status: 500 });
  }
}

// 创建新用户
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, roles } = body;

    // 生成密码哈希
    const passwordHash = hashPassword(password);

    // 获取角色ID
    const roleIds = await prisma.role.findMany({
      where: {
        name: {
          in: roles || []
        }
      },
      select: {
        id: true
      }
    });

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        roles: {
          create: roleIds.map(role => ({
            role: {
              connect: {
                id: role.id
              }
            }
          }))
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

    return NextResponse.json(user);
  } catch (error) {
    console.error("创建用户失败:", error);
    return NextResponse.json({ error: "创建用户失败" }, { status: 500 });
  }
}

// 更新用户
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")!;
    const body = await request.json();
    const { name, email, password, roles } = body;

    // 获取角色ID
    const roleIds = await prisma.role.findMany({
      where: {
        name: {
          in: roles || []
        }
      },
      select: {
        id: true
      }
    });

    const updateData: any = {
      name,
      email,
      roles: {
        deleteMany: {},
        create: roleIds.map(role => ({
          role: {
            connect: {
              id: role.id
            }
          }
        }))
      }
    };

    // 如果提供了新密码，则更新密码哈希
    if (password) {
      updateData.passwordHash = hashPassword(password);
    }

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      include: {
        roles: {
          include: {
            role: true
          }
        }
      }
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("更新用户失败:", error);
    return NextResponse.json({ error: "更新用户失败" }, { status: 500 });
  }
}

// 删除用户
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少用户ID" }, { status: 400 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: "用户删除成功" });
  } catch (error) {
    console.error("删除用户失败:", error);
    return NextResponse.json({ error: "删除用户失败" }, { status: 500 });
  }
} 