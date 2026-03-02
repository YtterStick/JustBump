import { prisma } from '../lib/prisma';

async function main() {
    try {
        const logs = await prisma.adminLog.findMany({
            take: 10,
            orderBy: { created_at: 'desc' },
            include: {
                admin: {
                    select: {
                        email: true
                    }
                }
            }
        });
        console.log(JSON.stringify(logs, null, 2));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        await prisma.$disconnect();
    }
}

main();
