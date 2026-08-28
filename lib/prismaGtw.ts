import { PrismaClient } from '@prisma/gtw-client'; // ← generate แยก

const globalForPrismaGtw = globalThis as unknown as {
  prismaGtw: PrismaClient | undefined;
};

const prismaGtw = globalForPrismaGtw.prismaGtw ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrismaGtw.prismaGtw = prismaGtw;
}

export default prismaGtw;