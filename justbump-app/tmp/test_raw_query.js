const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const result = await prisma.$queryRaw`SELECT * FROM admin_logs LIMIT 1`;
        console.log('Query success:', result);
    } catch (error) {
        console.error('Query failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
