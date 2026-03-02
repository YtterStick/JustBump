import { prisma } from '../lib/prisma';

async function main() {
    try {
        console.log('Available models on prisma object:');
        const properties = Object.getOwnPropertyNames(prisma);
        const models = properties.filter(p => !p.startsWith('$') && !p.startsWith('_'));
        console.log(models);

        console.log('Testing adminLog access...');
        // @ts-ignore
        if (prisma.adminLog) {
            console.log('adminLog exists');
        } else {
            console.log('adminLog DOES NOT exist');
        }

        // @ts-ignore
        if (prisma.admin_logs) {
            console.log('admin_logs exists');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        // @ts-ignore
        if (prisma.$disconnect) await prisma.$disconnect();
    }
}

main();
