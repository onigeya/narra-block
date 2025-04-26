import { PrismaClient, Prisma } from "../lib/generated/prisma";
import { hashPassword } from "../lib/password";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput = {
  email: "admin@admin.com",
  name: "admin",
  passwordHash: hashPassword("admin"),
  image: "https://github.com/shadcn.png",
};

export async function main() {
  await prisma.user.create({ data: userData });
}

main();
