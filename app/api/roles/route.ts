import { NextResponse } from "next/server";
import { prisma, Prisma } from "@/lib/db";

// 获取所有角色
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const pageSize = parseInt(searchParams.get("pageSize") || "10");
    const name = searchParams.get("name") || "";

    const where: Prisma.RoleWhereInput = {
      ...(name && { name: { contains: name, mode: Prisma.QueryMode.insensitive } }),
    };

    const [roles, total] = await Promise.all([
      prisma.role.findMany({
        where,
        include: {
          users: {
            include: {
              user: true
            }
          },
          permissions: {
            include: {
              permission: true
            }
          }
        },
        skip: (page - 1) * pageSize,
        take: pageSize,
        orderBy: {
          createdAt: "desc"
        }
      }),
      prisma.role.count({ where })
    ]);

    return NextResponse.json({ 
      roles: roles.map(role => ({
        ...role,
        permissions: role.permissions.map(rp => rp.permission.name)
      })),
      pagination: {
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      }
    });
  } catch (error) {
    console.error("获取角色列表失败:", error);
    return NextResponse.json({ error: "获取角色列表失败" }, { status: 500 });
  }
}

// 创建新角色
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, permissions } = body;

    // 首先创建角色
    const role = await prisma.role.create({
      data: {
        name,
        description,
      },
    });

    // 如果提供了权限，创建权限关联
    if (permissions && permissions.length > 0) {
      // 查找或创建权限
      const permissionRecords = await Promise.all(
        permissions.map(async (permissionName: string) => {
          return prisma.permission.upsert({
            where: { name: permissionName },
            update: {},
            create: { name: permissionName }
          });
        })
      );

      // 创建角色权限关联
      await Promise.all(
        permissionRecords.map(permission => 
          prisma.rolePermission.create({
            data: {
              roleId: role.id,
              permissionId: permission.id
            }
          })
        )
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("创建角色失败:", error);
    return NextResponse.json({ error: "创建角色失败" }, { status: 500 });
  }
}

// 更新角色
export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id")!;
    const body = await request.json();
    const { name, description, permissions } = body;

    // 更新角色基本信息
    const role = await prisma.role.update({
      where: { id },
      data: {
        name,
        description,
      },
    });

    // 更新权限关联
    if (permissions) {
      // 删除现有的权限关联
      await prisma.rolePermission.deleteMany({
        where: { roleId: id }
      });

      // 查找或创建权限
      const permissionRecords = await Promise.all(
        permissions.map(async (permissionName: string) => {
          return prisma.permission.upsert({
            where: { name: permissionName },
            update: {},
            create: { name: permissionName }
          });
        })
      );

      // 创建新的权限关联
      await Promise.all(
        permissionRecords.map(permission => 
          prisma.rolePermission.create({
            data: {
              roleId: id,
              permissionId: permission.id
            }
          })
        )
      );
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error("更新角色失败:", error);
    return NextResponse.json({ error: "更新角色失败" }, { status: 500 });
  }
}

// 删除角色
export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "缺少角色ID" }, { status: 400 });
    }

    // 删除角色（级联删除会同时删除关联的RolePermission记录）
    await prisma.role.delete({
      where: { id },
    });

    return NextResponse.json({ message: "角色删除成功" });
  } catch (error) {
    console.error("删除角色失败:", error);
    return NextResponse.json({ error: "删除角色失败" }, { status: 500 });
  }
} 