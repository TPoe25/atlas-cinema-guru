import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  const databaseUrl = process.env.DATABASE_URL;

  if (!databaseUrl) {
    throw new Error(
      "DATABASE_URL is not set. Add your production Postgres connection string in Vercel Project Settings -> Environment Variables.",
    );
  }

  const isVercel = process.env.VERCEL === "1";
  const isLocalOnlyHost = /(host\.docker\.internal|localhost|127\.0\.0\.1)/i.test(databaseUrl);

  if (isVercel && isLocalOnlyHost) {
    throw new Error(
      "DATABASE_URL points to a local-only host. Vercel cannot reach localhost or host.docker.internal. Use a managed Postgres URL from Neon, Supabase, Railway, or Vercel Postgres.",
    );
  }

  return databaseUrl;
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
