const bcrypt = require('bcrypt');
const pool = require('../src/config/db');

async function createAdmin() {
    try {
        const username = process.env.ADMIN_USERNAME;
        const password = process.env.ADMIN_PASSWORD;

        if (!username || !password) {
            throw new Error('Define ADMIN_USERNAME y ADMIN_PASSWORD antes de crear el administrador.');
        }

        console.log('Iniciando creación de administrador...');

        // 1. Crear rol ADMINISTRADOR si no existe
        const [roles] = await pool.query('SELECT * FROM roles WHERE nombre = ?', ['ADMINISTRADOR']);
        let id_rol;

        if (roles.length === 0) {
            const [result] = await pool.query('INSERT INTO roles (nombre) VALUES (?)', ['ADMINISTRADOR']);
            id_rol = result.insertId;
            console.log('Rol ADMINISTRADOR creado con ID:', id_rol);
        } else {
            id_rol = roles[0].id_rol;
            console.log('Rol ADMINISTRADOR ya existe con ID:', id_rol);
        }

        // 2. Crear usuario admin si no existe
        const [usuarios] = await pool.query('SELECT * FROM usuarios WHERE username = ?', [username]);
        
        if (usuarios.length === 0) {
            const saltRounds = 10;
            const passwordHash = await bcrypt.hash(password, saltRounds);
            
            await pool.query(
                'INSERT INTO usuarios (username, password_hash, id_rol, estado) VALUES (?, ?, ?, ?)', 
                [username, passwordHash, id_rol, true]
            );
            console.log(`Usuario ${username} creado con éxito.`);
        } else {
            console.log(`El usuario ${username} ya existe en la base de datos.`);
        }

    } catch (error) {
        console.error('Error:', error.message);
    } finally {
        // Cerrar la conexión del pool
        pool.end();
    }
}

createAdmin();
