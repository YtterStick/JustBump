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

    console.log('Querying columns for calling_cards...');
    const [rows] = await conn.query("SHOW COLUMNS FROM calling_cards");
    console.log(JSON.stringify(rows, null, 2));

    await conn.end();
  } catch (err) {
    console.error('Failed to query columns:', err);
    process.exit(1);
  }
})();
