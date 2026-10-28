const pool = require('../config/db');

const getUserByDni = async (dni) => {
    // Busca por la columna dni o usuario real en data_base_ugel
    const [rows] = await pool.query(
        `SELECT 
            u.cod_usuario AS id_usuario, 
            u.usuario AS username, 
            u.dni AS dni, 
            u.contraseña AS password_hash, 
            u.rol AS cod_rol,
            r.nom_rol AS nombre_rol 
         FROM usuario u 
         LEFT JOIN rol r ON u.rol = r.cod_rol 
         WHERE u.dni = ? OR u.usuario = ?`, 
        [dni, dni]
    );
    return rows[0]; // Retorna el primer usuario encontrado o undefined
};

module.exports = { getUserByDni };