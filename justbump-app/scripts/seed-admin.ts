import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    const email = 'admin@justbump.com';
    const password = 'Admin123!';

    // Check if admin already exists
    const existing = await prisma.user.findUnique({ where: { email } });

    if (existing) {
        console.log(`\n⚠  Admin user already exists: ${email}`);
        console.log('   No changes made.\n');
        return;
    }

    const password_hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: {
            email,
            password_hash,
            role: 'jbadmin',
            email_verified: true,
            is_active: true,
        },
    });

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   ID:       ${user.id}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     jbadmin\n`);
    console.log('   ⚠  Change this password in production!\n');
}

main()
    .catch((e) => {
        console.error('Error seeding admin:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
