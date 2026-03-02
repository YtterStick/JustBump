import { PrismaClient } from '@prisma/client';
import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import * as dotenv from 'dotenv';
import path from 'path';

// Load .env from parent directory
dotenv.config({ path: path.resolve(__dirname, '../.env') });

function generateRandomId() {
    return crypto.randomBytes(16).toString('hex');
}

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
    const password_hash = await bcrypt.hash('User123!', 10);

    const dummyData = [
        {
            email: 'andrei.dilag@example.com',
            full_name: 'Andrei Dilag',
            job_title: 'Software Dev Intern',
            company: 'NLP Business Development Services',
            headline: 'Innovating through code and dedication.',
            address: '15 Oak ext, st, west fairview q.c',
            bio_label: 'Bio',
            bio_text: 'A dedicated Software Development Intern at NLP Business Development Services, focusing on creating efficient and user-friendly web applications.',
            slug: 'andrei-d',
            contact_value: '+63 917 123 4567',
            theme_primary_color: '#1a56db',
            theme_background_color: '#f3f4f6',
            socials: [
                { platform: 'Facebook', url: 'https://www.facebook.com/ytterstick', handle: 'ytterstick' },
                { platform: 'Instagram', url: 'https://instagram.com/andrei.dev', handle: 'andrei.dev' }
            ],
            banks: [
                { provider: 'GCash', account_name: 'Andrei Dilag', account_number: '09171234567' },
                { provider: 'BDO', account_name: 'Andrei G. Dilag', account_number: '001234567890' }
            ],
            videos: [
                { title: 'Project Demo', url: 'https://www.facebook.com/watch/?v=123456789', description: 'Web Dev Showcase' }
            ],
            links: [
                { label: 'Portfolio', url: 'https://andreidilag.ph' }
            ]
        },
        {
            email: 'maria.santos@example.com',
            full_name: 'Maria Clara Santos',
            job_title: 'Marketing Manager',
            company: 'NLP Business Development Services',
            headline: 'Driving brand growth through strategic marketing.',
            address: 'BGC, Taguig City, Philippines',
            bio_label: 'Professional Bio',
            bio_text: 'An expert in digital marketing and brand strategy, leading successful campaigns at NLP Business Development Services.',
            slug: 'maria-s',
            contact_value: '+63 918 222 3333',
            theme_primary_color: '#db2777',
            theme_background_color: '#fdf2f8',
            socials: [
                { platform: 'LinkedIn', url: 'https://linkedin.com/in/mariaclarasantos', handle: 'mariaclara' }
            ],
            banks: [
                { provider: 'Maya', account_name: 'Maria Santos', account_number: '09182223333' }
            ],
            videos: [],
            links: [
                { label: 'Featured Article', url: 'https://businessmirror.com.ph/tech-trends' }
            ]
        },
        {
            email: 'juan.delacruz@example.com',
            full_name: 'Juan Dela Cruz',
            job_title: 'Real Estate Consultant',
            company: 'NLP Business Development Services',
            headline: 'Connecting people with their dream homes.',
            address: 'Makati City, Philippines',
            bio_label: 'About Me',
            bio_text: 'Experienced real estate professional with a passion for helping families find their perfect properties.',
            slug: 'juan-dc',
            contact_value: '+63 920 444 5555',
            theme_primary_color: '#059669',
            theme_background_color: '#f0fdf4',
            socials: [],
            banks: [
                { provider: 'GCash', account_name: 'Juan Dela Cruz', account_number: '09204445555' }
            ],
            videos: [],
            links: [
                { label: 'Property Listings', url: 'https://ayalaland.com.ph' }
            ]
        }
    ];

    console.log('Seeding dummy data...');

    for (const data of dummyData) {
        // Create user
        const user = await prisma.user.upsert({
            where: { email: data.email },
            update: {},
            create: {
                email: data.email,
                password_hash,
                role: 'User',
                email_verified: true,
                is_active: true
            }
        });

        // Create/Update calling card
        const card = await prisma.callingCard.upsert({
            where: { user_id: user.id },
            update: {
                full_name: data.full_name,
                job_title: data.job_title,
                company: data.company,
                headline: data.headline,
                address: data.address,
                bio_label: data.bio_label,
                bio_text: data.bio_text,
                slug: data.slug,
                contact_value: data.contact_value,
                theme_primary_color: data.theme_primary_color,
                theme_background_color: data.theme_background_color
            },
            create: {
                user_id: user.id,
                full_name: data.full_name,
                job_title: data.job_title,
                company: data.company,
                headline: data.headline,
                address: data.address,
                bio_label: data.bio_label,
                bio_text: data.bio_text,
                slug: data.slug,
                sharing_id: generateRandomId(),
                contact_value: data.contact_value,
                theme_primary_color: data.theme_primary_color,
                theme_background_color: data.theme_background_color
            }
        });

        // Clear existing relations for clean seed
        await prisma.socialLink.deleteMany({ where: { calling_card_id: card.id } });
        await prisma.bankDetail.deleteMany({ where: { calling_card_id: card.id } });
        await prisma.videoLink.deleteMany({ where: { calling_card_id: card.id } });
        await prisma.externalLink.deleteMany({ where: { calling_card_id: card.id } });

        // Add socials
        if (data.socials?.length) {
            await prisma.socialLink.createMany({
                data: data.socials.map(s => ({ ...s, calling_card_id: card.id }))
            });
        }

        // Add banks
        if (data.banks?.length) {
            await prisma.bankDetail.createMany({
                data: data.banks.map(b => ({ ...b, calling_card_id: card.id }))
            });
        }

        // Add videos
        if (data.videos?.length) {
            await prisma.videoLink.createMany({
                data: data.videos.map(v => ({ ...v, calling_card_id: card.id }))
            });
        }

        // Add links
        if (data.links?.length) {
            await prisma.externalLink.createMany({
                data: data.links.map(l => ({ ...l, calling_card_id: card.id }))
            });
        }

        console.log(`Created/Updated card for: ${data.full_name}`);
    }

    console.log('Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('Error seeding dummy data:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
