const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

(async () => {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT || 3306),
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'JBDB'
    });

    const [rows] = await conn.query('SHOW TABLES');
    console.log('Tables in', process.env.DB_NAME || 'JBDB');
    rows.forEach(r => console.log(Object.values(r)[0]));
    await conn.end();
  } catch (err) {
    console.error('Error listing tables:', err.message || err);
    process.exit(1);
  }
})();
