import { PrismaClient, Prisma } from "../lib/generated/prisma";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  email: "admin@admin.com",
  name: "admin",
  passwordHash: hashPassword("admin"),
  image: "https://github.com/shadcn.png",
};

const systemPermissions = [
  {
    name: "system:query",
    description: "系统查询权限",
  },
  {
    name: "system:create",
    description: "系统创建权限",
  },
  {
    name: "system:update",
    description: "系统修改权限",
  },
  {
    name: "system:delete",
    description: "系统删除权限",
  },
];

async function createAdminUser(): Promise<string | null> {
  const existingAdmin = await prisma.user.findUnique({
    where: { email: userData.email },
  });

  if (existingAdmin) {
    console.log("管理员账号已存在，跳过创建");
    return existingAdmin.id;
  }

  const admin = await prisma.user.create({ data: userData });
  console.log("管理员账号创建成功");
  return admin.id;
}

async function createAdminRole(): Promise<string | null> {
  const existingRole = await prisma.role.findUnique({
    where: { name: "admin" },
  });

  if (existingRole) {
    console.log("管理员角色已存在，跳过创建");
    return existingRole.id;
  }

  const adminRole = await prisma.role.create({
    data: {
      name: "admin",
      description: "系统管理员",
    },
  });
  console.log("管理员角色创建成功");
  return adminRole.id;
}

async function createSystemPermissions(): Promise<string[]> {
  const permissionIds: string[] = [];

  for (const permission of systemPermissions) {
    const existingPermission = await prisma.permission.findUnique({
      where: { name: permission.name },
    });

    if (existingPermission) {
      console.log(`权限 ${permission.name} 已存在，跳过创建`);
      permissionIds.push(existingPermission.id);
      continue;
    }

    const newPermission = await prisma.permission.create({
      data: permission,
    });
    console.log(`权限 ${permission.name} 创建成功`);
    permissionIds.push(newPermission.id);
  }

  return permissionIds;
}

async function assignPermissionsToRole(roleId: string, permissionIds: string[]) {
  for (const permissionId of permissionIds) {
    const existingAssignment = await prisma.rolePermission.findUnique({
      where: {
        roleId_permissionId: {
          roleId,
          permissionId,
        },
      },
    });

    if (existingAssignment) {
      console.log(`权限 ${permissionId} 已分配给角色，跳过分配`);
      continue;
    }

    await prisma.rolePermission.create({
      data: {
        roleId,
        permissionId,
      },
    });
    console.log(`权限 ${permissionId} 分配成功`);
  }
}

async function assignRoleToUser(userId: string, roleId: string) {
  const existingAssignment = await prisma.userRole.findUnique({
    where: {
      userId_roleId: {
        userId,
        roleId,
      },
    },
  });

  if (existingAssignment) {
    console.log("角色已分配给用户，跳过分配");
    return;
  }

  await prisma.userRole.create({
    data: {
      userId,
      roleId,
    },
  });
  console.log("角色分配成功");
}

export async function main() {
  const adminId = await createAdminUser();
  if (!adminId) return;

  const roleId = await createAdminRole();
  if (!roleId) return;

  const permissionIds = await createSystemPermissions();
  if (permissionIds.length === 0) return;

  await assignPermissionsToRole(roleId, permissionIds);
  await assignRoleToUser(adminId, roleId);
}

main();
