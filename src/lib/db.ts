import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

function createPrismaClient() {
  const dbPath = path.join(process.cwd(), "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: dbPath });
  return new PrismaClient({ adapter } as never);
}

const globalForPrisma = globalThis as typeof globalThis & {
  _prisma?: PrismaClient;
};

export const prisma: PrismaClient =
  globalForPrisma._prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma._prisma = prisma;
}
