const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

(async () => {
  try {
    const host = process.env.DB_HOST || 'localhost';
    const port = Number(process.env.DB_PORT || 3306);
    const user = process.env.DB_USER || 'root';
    const password = process.env.DB_PASSWORD || '';

    const schemaPath = path.resolve(__dirname, '..', '..', 'justbump-db', 'queries', 'schema.sql');
    if (!fs.existsSync(schemaPath)) {
      console.error('Schema file not found:', schemaPath);
      process.exit(1);
    }
    const sql = fs.readFileSync(schemaPath, 'utf8');

    const conn = await mysql.createConnection({
      host,
      port,
      user,
      password,
      multipleStatements: true
    });

    console.log('Applying schema to', `${user}@${host}:${port}`);
    await conn.query(sql);
    console.log('Schema applied successfully.');
    await conn.end();
  } catch (err) {
    console.error('Failed to apply schema:', err);
    process.exit(1);
  }
})();
