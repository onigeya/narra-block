import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { Prisma } from "@/lib/db";

// 获取所有权限
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const name = searchParams.get("name") || "";

    const where: Prisma.PermissionWhereInput = {
      ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
    };

    const [permissions, total] = await Promise.all([
      prisma.permission.findMany({
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
          name: "asc"
        }
      }),
      prisma.permission.count({ where })
    ]);

    return NextResponse.json({ 
      permissions,
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("获取权限列表失败:", error);
    return NextResponse.json({ error: "获取权限列表失败" }, { status: 500 });
  }
}

// 创建新权限
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description } = body;

    const permission = await prisma.permission.create({
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("创建权限失败:", error);
    return NextResponse.json({ error: "创建权限失败" }, { status: 500 });
  }
}

// 更新权限
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, name, description } = body;

    const permission = await prisma.permission.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    return NextResponse.json(permission);
  } catch (error) {
    console.error("更新权限失败:", error);
    return NextResponse.json({ error: "更新权限失败" }, { status: 500 });
  }
}

// 删除权限
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少权限ID" }, { status: 400 });
    }

    await prisma.permission.delete({
      where: { id },
    });

    return NextResponse.json({ message: "权限删除成功" });
  } catch (error) {
    console.error("删除权限失败:", error);
    return NextResponse.json({ error: "删除权限失败" }, { status: 500 });
  }
} 