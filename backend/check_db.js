const pool = require('./src/config/db');

async function checkSchema() {
  try {
    const tables = ['expedientes_licencia', 'detalles_licencia', 'documentos_medicos', 'cat_permisos'];
    for (const table of tables) {
      console.log(`\n--- Schema for ${table} ---`);
      try {
        const [rows] = await pool.query(`DESCRIBE ${table}`);
        console.log(rows);
      } catch (err) {
        console.log(`Error describing ${table}: ${err.message}`);
      }
    }
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

checkSchema();
