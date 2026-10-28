const pool = require('../config/db');

const getAllUsers = async () => {
    const [rows] = await pool.query(
        `SELECT u.cod_usuario as id_usuario, u.usuario as username, u.dni, u.telefono, u.correo as correo_electronico, r.nom_rol AS rol 
         FROM usuario u 
         LEFT JOIN rol r ON u.rol = r.cod_rol`
    );
    return rows;
};

const getProfileByDni = async (dni) => {
    const [rows] = await pool.query(
        `SELECT dni, usuario as nombre, '' as apellido, telefono, correo as correo_electronico 
         FROM usuario WHERE dni = ?`,
        [dni]
    );
    return rows[0];
};

const updateProfileByDni = async (dni, data) => {
    const { nombre, telefono, correo_electronico } = data;
    await pool.query(
        `UPDATE usuario SET usuario = ?, telefono = ?, correo = ? WHERE dni = ?`,
        [nombre, telefono, correo_electronico, dni]
    );
};

const getPasswordHashByDni = async (dni) => {
    const [rows] = await pool.query(
        `SELECT contraseña as password_hash FROM usuario WHERE dni = ?`,
        [dni]
    );
    return rows[0]?.password_hash;
};

const updatePasswordByDni = async (dni, hash) => {
    await pool.query(
        `UPDATE usuario SET contraseña = ? WHERE dni = ?`,
        [hash, dni]
    );
};

module.exports = { getAllUsers, getProfileByDni, updateProfileByDni, getPasswordHashByDni, updatePasswordByDni };
