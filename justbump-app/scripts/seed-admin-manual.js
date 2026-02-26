const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

async function seed() {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 3306),
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: 'jbdb'
    });

    try {
        const email = 'admin@justbump.com';
        const password = 'Admin123!';
        const password_hash = await bcrypt.hash(password, 10);

        const [rows] = await connection.execute('SELECT id FROM users WHERE email = ?', [email]);
        if (rows.length > 0) {
            console.log('Admin user already exists');
            return;
        }

        await connection.execute(
            'INSERT INTO users (email, password_hash, role, email_verified, is_active) VALUES (?, ?, ?, ?, ?)',
            [email, password_hash, 'jbadmin', 1, 1]
        );
        console.log('Admin user seeded successfully');
    } catch (err) {
        console.error('Seeding failed:', err);
    } finally {
        await connection.end();
    }
}

seed();
