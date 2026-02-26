const mysql = require('mysql2/promise');
require('dotenv').config();

async function run() {
    const config = {
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'jbdb',
    };

    console.log('Connecting to:', config.host, config.database);
    const connection = await mysql.createConnection(config);

    try {
        console.log('Force changing column type to VARCHAR to allow rename...');
        await connection.execute("ALTER TABLE users MODIFY role VARCHAR(50)");

        console.log('Updating roles...');
        const [res1] = await connection.execute("UPDATE users SET role = 'Admin' WHERE role = 'jbadmin'");
        const [res2] = await connection.execute("UPDATE users SET role = 'User' WHERE role = 'jbuser'");
        console.log('Updated Admins:', res1.affectedRows);
        console.log('Updated Users:', res2.affectedRows);
    } catch (err) {
        console.error('Error:', err.message);
    } finally {
        await connection.end();
    }
}

run();
