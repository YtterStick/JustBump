const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });

const TARGET_DB = 'jbdb';

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

    // Remove manual database creation and USE entries to avoid conflicts
    sql = sql.replace(/CREATE\s+DATABASE\s+IF\s+NOT\s+EXISTS\s+\w+\s*[^;]*;?/gi, '');
    sql = sql.replace(/ALTER\s+DATABASE\s+\w+\s*[^;]*;?/gi, '');
    sql = sql.replace(/USE\s+\w+\s*;?/gi, '');

    const conn = await mysql.createConnection({ host, port, user, password, multipleStatements: true });
    console.log(`Connected to MySQL at ${host}:${port} as ${user}`);

    console.log(`Cleaning up old databases...`);
    await conn.query(`DROP DATABASE IF EXISTS just_bump_db;`);
    await conn.query(`DROP DATABASE IF EXISTS ${TARGET_DB};`);

    console.log(`Creating database ${TARGET_DB} exists...`);
    await conn.query(`CREATE DATABASE ${TARGET_DB} CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`);
    await conn.query(`USE ${TARGET_DB};`);
    console.log(`Applying schema to ${TARGET_DB}...`);
    await conn.query(sql);
    console.log('Schema applied successfully to', TARGET_DB);
    await conn.end();
  } catch (err) {
    console.error('Failed to create/apply JBDB:', err.message || err);
    process.exit(1);
  }
})();
