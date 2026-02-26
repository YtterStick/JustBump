import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

if (!globalForPrisma.prisma) {
    console.log('--- Initializing Prisma Client Singleton ---');
    const poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'jbdb',
    };

    console.log('Pool Config:', { ...poolConfig, password: '***' });

    try {
        const adapter = new PrismaMariaDb(poolConfig);
        globalForPrisma.prisma = new PrismaClient({ adapter });
        console.log('Prisma Client construction successful.');
    } catch (err) {
        console.error('FAILED to initialize Prisma Client:', err);
    }
}

export const prisma = globalForPrisma.prisma!;
export default prisma;
