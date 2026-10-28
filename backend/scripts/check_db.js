const mysql = require('mysql2/promise');
require('dotenv').config();

async function check() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: process.env.DB_PORT || 3306,
    });
    
    const tables = ['nivel_edu', 'tipo_trabajador', 'subtipo_trabajador', 'cargo_trabajador', 'categoria', 'estado', 'ley', 'distrito', 'institucion'];
    for (const t of tables) {
        const [desc] = await pool.query(`DESCRIBE ${t}`);
        console.log(t, desc.map(d => d.Field));
    }

    process.exit();
}
check();
