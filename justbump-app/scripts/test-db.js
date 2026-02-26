const mysql = require('mysql2/promise');
require('dotenv').config();

const poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'jbdb',
};

async function test() {
    console.log('Testing connection with:', poolConfig);
    try {
        const connection = await mysql.createConnection(poolConfig);
        console.log('Connection successful!');
        const [rows] = await connection.execute('SELECT 1 + 1 AS result');
        console.log('Query successful, result:', rows[0].result);
        await connection.end();
    } catch (err) {
        console.error('Connection failed:', err);
    }
}

test();
