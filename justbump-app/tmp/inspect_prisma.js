const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
    try {
        const keys = Object.keys(prisma);
        console.log('Available prisma properties:', keys.filter(k => !k.startsWith('_')));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
