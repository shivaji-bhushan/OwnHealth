import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

// On Vercel Serverless, the root directory (/var/task) is read-only.
// We copy the seeded prisma/dev.db into /tmp/dev.db where SQLite has full read+write permissions.
if (process.env.VERCEL) {
  try {
    const tmpDbPath = path.join("/tmp", "dev.db");
    const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");
    if (!fs.existsSync(tmpDbPath) && fs.existsSync(sourceDbPath)) {
      fs.copyFileSync(sourceDbPath, tmpDbPath);
    }
    process.env.DATABASE_URL = `file:${tmpDbPath}`;
  } catch (err) {
    console.warn("Could not copy database to /tmp on Vercel:", err);
  }
}

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["warn", "error"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

export default prisma;
