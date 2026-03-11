const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

(async () => {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';
    const database = process.env.DB_NAME || 'jbdb';

    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      database
    });

    console.log('--- CALLING CARDS COLUMNS ---');
    const [ccRows] = await conn.query("SHOW COLUMNS FROM calling_cards");
    ccRows.forEach(row => console.log(row.Field));

    console.log('\n--- PHYSICAL CARDS COLUMNS ---');
    const [pcRows] = await conn.query("SHOW COLUMNS FROM physical_cards");
    pcRows.forEach(row => console.log(row.Field));

    await conn.end();
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
})();
