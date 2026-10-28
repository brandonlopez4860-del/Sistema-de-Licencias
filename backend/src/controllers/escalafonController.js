const pool = require('../config/db');

const getLicencias = async (req, res) => {
    try {
        const query = `
            SELECT 
              esc_exp AS codigo,
              esc_exp AS expediente,
              esc_dni AS dni,
              esc_ape_pat AS apePat,
              esc_ape_mat AS apeMat,
              esc_nombres AS nombres,
              CONCAT(esc_nombres, ' ', esc_ape_pat, ' ', esc_ape_mat) AS trabajador,
              esc_colegio AS colegio,
              DATE_FORMAT(esc_registro, '%d/%m/%Y') AS registro,
              DATE_FORMAT(esc_inicio, '%d/%m/%Y') AS inicio,
              DATE_FORMAT(esc_fin, '%d/%m/%Y') AS final,
              esc_total AS dias,
              CASE WHEN permiso = 1 THEN 'CITT' WHEN permiso = 2 THEN 'CERTIFICADO_PARTICULAR' ELSE 'NINGUNO' END AS permiso,
              esc_codigo_permiso AS cPermiso,
              CASE WHEN tipo_permiso = 1 THEN 'ENFERMEDAD' WHEN tipo_permiso = 2 THEN 'MATERNIDAD' ELSE 'NINGUNO' END AS tPermiso
            FROM escalafon
            ORDER BY esc_registro DESC;
        `;
        const [rows] = await pool.query(query);
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const getTrabajadorByDni = async (req, res) => {
    const { dni } = req.params;
    try {
        const query = `
            SELECT 
                t.cod_trabajador AS id_trabajador,
                t.dni,
                t.ape_pat,
                t.ape_mat,
                t.nombres,
                t.cod_plaza,
                t.institucion AS cod_mod_institucion,
                COALESCE(i.institucion, t.institucion) AS colegio,
                t.cod_trabajador AS id_historial,
                t.tipo_trabajador AS id_tipo_trabajador,
                COALESCE(tt.tipo_trabajador, '') AS tipoTrabajador,
                t.subtipo_trabajador AS id_subtipo_trabajador,
                COALESCE(st.subtipo_trabajador, '') AS subTipo,
                t.cargo_trabajador AS id_cargo,
                COALESCE(c.cargo_trabajador, '') AS cargo,
                t.categoria AS id_categoria,
                COALESCE(cat.categoria, '') AS categoria,
                t.ley AS id_ley,
                COALESCE(l.ley, '') AS ley
            FROM trabajador t
            LEFT JOIN institucion i ON i.cod_mod = t.institucion
            LEFT JOIN tipo_trabajador tt ON tt.cod_tipo = t.tipo_trabajador
            LEFT JOIN subtipo_trabajador st ON st.cod_subtipo = t.subtipo_trabajador
            LEFT JOIN cargo_trabajador c ON c.cod_cargo = t.cargo_trabajador
            LEFT JOIN categoria cat ON cat.cod_categoria = t.categoria
            LEFT JOIN ley l ON l.cod_ley = t.ley
            WHERE t.dni = ?
        `;
        const [rows] = await pool.query(query, [dni]);
        if (rows.length > 0) {
            res.json({ ok: true, data: rows[0] });
        } else {
            res.json({ ok: false, message: 'Trabajador no encontrado' });
        }
    } catch (error) {
        console.error('Error fetching trabajador:', error);
        res.status(500).json({ ok: false, message: 'Error interno' });
    }
};

const registrarLicencia = async (req, res) => {
    const { 
        id_trabajador,
        id_historial_laboral,
        fecha_registro,
        inicio_descanso,
        fin_descanso,
        dias,
        sustento,
        codigo_permiso,
        tipo_permiso
    } = req.body;

    try {
        const [tRows] = await pool.query('SELECT * FROM trabajador WHERE cod_trabajador = ?', [id_trabajador]);
        if(tRows.length === 0) return res.status(404).json({ok: false, message: 'Trabajador no encontrado'});
        const t = tRows[0];

        const nro_expediente = Math.floor(Math.random() * 1000000); 

        let p_val = sustento === 'CITT' ? 1 : (sustento === 'CERTIFICADO PARTICULAR' ? 2 : 3);
        let tp_val = tipo_permiso === 'ENFERMEDAD' ? 1 : 2;

        await pool.query(
            `INSERT INTO escalafon 
            (esc_exp, esc_trabajador, esc_dni, esc_ape_pat, esc_ape_mat, esc_nombres, 
             esc_tipo_trabajador, esc_subtipo_trabajador, esc_cargo_trabajador, esc_categoria, esc_colegio, 
             esc_registro, esc_inicio, esc_fin, esc_total, permiso, esc_codigo_permiso, tipo_permiso)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [nro_expediente, id_trabajador, t.dni, t.ape_pat, t.ape_mat, t.nombres,
             t.tipo_trabajador, t.subtipo_trabajador, t.cargo_trabajador, t.categoria, t.institucion,
             fecha_registro, inicio_descanso, fin_descanso, dias, p_val, codigo_permiso, tp_val]
        );

        res.json({ ok: true, message: 'Licencia registrada' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno al registrar la licencia' });
    }
};

const actualizarLicencia = async (req, res) => {
    const { codigo } = req.params; 
    const { 
        fecha_registro,
        inicio_descanso,
        fin_descanso,
        dias,
        sustento,
        codigo_permiso,
        tipo_permiso
    } = req.body;

    try {
        let p_val = sustento === 'CITT' ? 1 : (sustento === 'CERTIFICADO PARTICULAR' ? 2 : 3);
        let tp_val = tipo_permiso === 'ENFERMEDAD' ? 1 : 2;

        await pool.query(
            `UPDATE escalafon
             SET esc_registro = ?, esc_inicio = ?, esc_fin = ?, esc_total = ?, permiso = ?, esc_codigo_permiso = ?, tipo_permiso = ?
             WHERE esc_exp = ?`,
            [fecha_registro, inicio_descanso, fin_descanso, dias, p_val, codigo_permiso, tp_val, codigo]
        );

        res.json({ ok: true, message: 'Licencia actualizada' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno' });
    }
};

const eliminarLicencia = async (req, res) => {
    const { codigo } = req.params;
    try {
        await pool.query('DELETE FROM escalafon WHERE esc_exp = ?', [codigo]);
        res.json({ ok: true, message: 'Licencia eliminada' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno' });
    }
};

module.exports = {
    getLicencias,
    getTrabajadorByDni,
    registrarLicencia,
    actualizarLicencia,
    eliminarLicencia
};
