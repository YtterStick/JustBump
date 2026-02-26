const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jbdb',
};

async function test() {
    console.log('Initialing Prisma with:', poolConfig);
    const adapter = new PrismaMariaDb(poolConfig);
    const prisma = new PrismaClient({ adapter });
    try {
        console.log('Querying users...');
        const users = await prisma.user.findMany({
            select: { id: true, email: true, role: true }
        });
        console.log('Query result:', users);
    } catch (err) {
        console.error('Prisma test failed:', err);
    } finally {
        console.log('Disconnecting...');
        await prisma.$disconnect();
    }
}

test();
