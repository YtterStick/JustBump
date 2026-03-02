import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jbdb',
};

const adapter = new PrismaMariaDb(poolConfig);
const prisma = new PrismaClient({ adapter });

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
            role: 'Admin',
            email_verified: true,
            is_active: true,
        },
    });

    console.log(`\n✅ Admin user created successfully!`);
    console.log(`   ID:       ${user.id}`);
    console.log(`   Email:    ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   Role:     Admin\n`);
    console.log('   ⚠  Change this password in production!\n');
}

main()
    .catch((e) => {
        console.error('Error seeding admin:', e);
        process.exit(1);
    })
    .finally(() => prisma.$disconnect());
