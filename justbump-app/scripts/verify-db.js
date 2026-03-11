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

    console.log('=== CALLING CARDS COLUMNS ===');
    const [ccCols] = await conn.query('SHOW COLUMNS FROM calling_cards');
    ccCols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));

    console.log('\n=== PHYSICAL CARDS COLUMNS ===');
    const [pcCols] = await conn.query('SHOW COLUMNS FROM physical_cards');
    pcCols.forEach(c => console.log(`  ${c.Field} (${c.Type})`));

    console.log('\n=== TABLES ===');
    const [tables] = await conn.query('SHOW TABLES');
    tables.forEach(t => console.log(`  ${Object.values(t)[0]}`));

    await conn.end();
})();
