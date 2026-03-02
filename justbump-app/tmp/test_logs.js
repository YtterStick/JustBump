const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const logs = await prisma.adminLog.findMany();
        console.log('Logs found:', logs.length);
        console.log('Sample log:', logs[0]);
    } catch (error) {
        console.error('Error querying adminLog:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
