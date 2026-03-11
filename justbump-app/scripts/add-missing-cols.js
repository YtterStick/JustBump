const mysql = require('mysql2/promise');

(async () => {
    const dbPassword = process.env.DB_PASSWORD;
    if (!dbPassword) {
        throw new Error('DB_PASSWORD environment variable is not set');
    }
    const conn = await mysql.createConnection({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: dbPassword,
        database: 'jbdb'
    });

    // First, check what columns exist
    const [cols] = await conn.query('SHOW COLUMNS FROM calling_cards');
    const existing = new Set(cols.map(c => c.Field));
    console.log('Existing columns:', [...existing].join(', '));

    const toAdd = [];

    if (!existing.has('cover_image_url')) {
        toAdd.push("ADD COLUMN `cover_image_url` VARCHAR(512) NULL DEFAULT NULL AFTER `profile_image_url`");
    }
    if (!existing.has('theme_text_color')) {
        toAdd.push("ADD COLUMN `theme_text_color` VARCHAR(7) NULL DEFAULT '#FFFFFF' AFTER `theme_secondary_color`");
    }
    if (!existing.has('theme_layout')) {
        toAdd.push("ADD COLUMN `theme_layout` VARCHAR(50) NULL DEFAULT 'standard' AFTER `theme_background_color`");
    }
    if (!existing.has('theme_font')) {
        toAdd.push("ADD COLUMN `theme_font` VARCHAR(50) NULL DEFAULT 'inter' AFTER `theme_layout`");
    }
    if (!existing.has('bios')) {
        toAdd.push("ADD COLUMN `bios` JSON NULL AFTER `theme_font`");
    }

    if (toAdd.length === 0) {
        console.log('All columns already exist!');
    } else {
        const sql = `ALTER TABLE calling_cards ${toAdd.join(', ')}`;
        console.log('Running:', sql);
        await conn.query(sql);
        console.log('SUCCESS: Added', toAdd.length, 'columns');
    }

    // Verify
    const [newCols] = await conn.query('SHOW COLUMNS FROM calling_cards');
    console.log('\nFinal columns:');
    newCols.forEach(c => console.log(' ', c.Field));

    await conn.end();
})();
