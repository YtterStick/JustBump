const { PrismaClient } = require('@prisma/client');
const { PrismaMariaDb } = require('@prisma/adapter-mariadb');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function main() {
    const poolConfig = {
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'jbdb',
    };

    try {
        console.log('Initializing Prisma with MariaDB adapter...');
        const adapter = new PrismaMariaDb(poolConfig);
        const prisma = new PrismaClient({ adapter });

        console.log('Testing prisma.physicalCard.findMany...');
        const cards = await prisma.physicalCard.findMany({
            where: { deleted_at: null },
            include: {
                calling_card: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                email: true
                            }
                        }
                    }
                },
            },
            orderBy: { created_at: 'asc' },
        });
        console.log('Success! Found', cards.length, 'cards.');
        await prisma.$disconnect();
    } catch (error) {
        console.error('ERROR DETECTED:');
        console.error(error.message);
        if (error.stack) console.error(error.stack);
    }
}

main();
