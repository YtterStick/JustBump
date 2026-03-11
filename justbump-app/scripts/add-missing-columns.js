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

    console.log('Adding missing columns to calling_cards table...');
    
    // Add missing columns if they don't exist
    const queries = [
      "ALTER TABLE calling_cards ADD COLUMN IF NOT EXISTS cover_image_url VARCHAR(512) DEFAULT NULL AFTER profile_image_url",
      "ALTER TABLE calling_cards ADD COLUMN IF NOT EXISTS theme_text_color VARCHAR(7) DEFAULT '#FFFFFF' AFTER theme_secondary_color",
      "ALTER TABLE calling_cards ADD COLUMN IF NOT EXISTS theme_layout VARCHAR(50) DEFAULT 'standard' AFTER theme_background_color",
      "ALTER TABLE calling_cards ADD COLUMN IF NOT EXISTS theme_font VARCHAR(50) DEFAULT 'inter' AFTER theme_layout"
    ];

    for (const q of queries) {
      try {
        await conn.query(q);
        console.log(`Executed: ${q}`);
      } catch (e) {
        console.warn(`Query failed (might already exist): ${q}`, e.message);
      }
    }

    console.log('Columns restored successfully.');
    await conn.end();
  } catch (err) {
    console.error('Failed to restore columns:', err);
    process.exit(1);
  }
})();
