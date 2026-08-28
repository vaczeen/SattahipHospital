import { PrismaClient } from "@prisma/client";
import { seedDepartmentConfig } from "./seeds/departmentConfig";
import { seedDepartment } from "./seeds/department";

const prisma = new PrismaClient();

async function main() {
  await seedDepartmentConfig(prisma);
  await seedDepartment(prisma);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());