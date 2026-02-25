const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env.local') });

const TARGET_DB = 'JBDB';

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

    let sql = fs.readFileSync(schemaPath, 'utf8');
    // Remove any code fence markers (```sql / ```)
    sql = sql.replace(/```\w*\r?\n?/g, '');

    // Replace database creation/USE entries to target DB
    sql = sql.replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+\w+\s*;?/i, `CREATE DATABASE IF NOT EXISTS ${TARGET_DB};`);
    sql = sql.replace(/USE\s+\w+\s*;?/i, `USE ${TARGET_DB};`);

    const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
    console.log(`Connected to MySQL at ${host}:${port} as ${user}`);

    console.log(`Ensuring database ${TARGET_DB} exists...`);
    await conn.query(`CREATE DATABASE IF NOT EXISTS ${TARGET_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    console.log(`Applying schema to ${TARGET_DB}...`);
    await conn.query(sql);
    console.log('Schema applied successfully to', TARGET_DB);
    await conn.end();
  } catch (err) {
    console.error('Failed to create/apply JBDB:', err.message || err);
    process.exit(1);
  }
})();
