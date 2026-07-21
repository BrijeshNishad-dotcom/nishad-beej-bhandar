import { PrismaClient } from '@prisma/client';
import { PrismaBetterSqlite3 } from '@prisma/adapter-better-sqlite3';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import path from 'path';

declare global {
  var prisma: PrismaClient | undefined;
  var pgPool: Pool | undefined;
}

const databaseUrl = process.env.DATABASE_URL || 'file:./dev.db';

export const pool = globalThis.pgPool ?? new Pool({
  connectionString: databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://') ? databaseUrl : undefined
});

if (process.env.NODE_ENV !== 'production') {
  globalThis.pgPool = pool;
}

const createPrismaClient = (): PrismaClient => {
  if (databaseUrl.startsWith('postgresql://') || databaseUrl.startsWith('postgres://')) {
    const adapter = new PrismaPg(pool);
    return new PrismaClient({ adapter });
  } else {
    // Resolve file path for SQLite relative to the root of the project
    const filePrefix = 'file:';
    let dbPath = databaseUrl;
    if (dbPath.startsWith(filePrefix)) {
      dbPath = dbPath.slice(filePrefix.length);
    }
    const resolvedPath = path.resolve(process.cwd(), dbPath);
    const adapter = new PrismaBetterSqlite3({ url: 'file:' + resolvedPath });
    return new PrismaClient({ adapter });
  }
};

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

