const pool = require('../config/db');

const getTrabajadores = async (req, res) => {
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
                i.institucion AS institucion_nombre,
                t.jornada AS horas_jornada,
                DATE_FORMAT(t.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
                DATE_FORMAT(t.fecha_final, '%Y-%m-%d') AS fecha_final,
                t.categoria AS id_categoria,
                cat.categoria AS categoria_nombre,
                t.ley AS id_ley,
                l.ley AS ley_nombre,
                t.estado AS id_estado_laboral,
                e.estado AS estado_nombre,
                t.cargo_trabajador AS id_cargo,
                c.cargo_trabajador AS cargo_nombre,
                t.tipo_trabajador AS id_tipo_trabajador,
                tt.tipo_trabajador AS tipo_trabajador_nombre,
                t.subtipo_trabajador AS id_subtipo_trabajador,
                st.subtipo_trabajador AS subtipo_trabajador_nombre,
                t.nivel_edu AS id_nivel_educativo,
                n.nivel AS nivel_nombre,
                t.distrito AS id_distrito,
                d.distrito AS distrito_nombre,
                t.cod_trabajador AS id_historial
            FROM trabajador t
            LEFT JOIN nivel_edu n ON t.nivel_edu = n.cod_nivel
            LEFT JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.cod_tipo
            LEFT JOIN subtipo_trabajador st ON t.subtipo_trabajador = st.cod_subtipo
            LEFT JOIN cargo_trabajador c ON t.cargo_trabajador = c.cod_cargo
            LEFT JOIN categoria cat ON t.categoria = cat.cod_categoria
            LEFT JOIN estado e ON t.estado = e.cod_estado
            LEFT JOIN ley l ON t.ley = l.cod_ley
            LEFT JOIN distrito d ON t.distrito = d.cod_distrito
            LEFT JOIN institucion i ON t.institucion = i.cod_mod
            ORDER BY t.cod_trabajador DESC
        `;
        const [rows] = await pool.query(query);
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error('Error fetching trabajadores:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const getCargos = async (req, res) => {
    try {
        const query = 'SELECT cod_cargo AS id_cargo, cargo_trabajador AS cargo_nombre, subtipo_trabajador FROM cargo_trabajador ORDER BY cargo_trabajador ASC';
        const [rows] = await pool.query(query);
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error('Error fetching cargos:', error);
        res.status(500).json({ ok: false, message: 'Error interno al obtener cargos' });
    }
};

const getCatalogosTrabajador = async (req, res) => {
    try {
        const [
            [cargos],
            [tipos],
            [subtipos],
            [niveles],
            [categorias],
            [estados],
            [leyes],
            [distritos],
            [instituciones]
        ] = await Promise.all([
            pool.query('SELECT cod_cargo AS id, cargo_trabajador AS nombre, subtipo_trabajador FROM cargo_trabajador ORDER BY cargo_trabajador ASC'),
            pool.query('SELECT cod_tipo AS id, tipo_trabajador AS nombre FROM tipo_trabajador ORDER BY cod_tipo ASC'),
            pool.query('SELECT cod_subtipo AS id, subtipo_trabajador AS nombre, tipo_trabajador FROM subtipo_trabajador ORDER BY cod_subtipo ASC'),
            pool.query('SELECT cod_nivel AS id, nivel AS nombre FROM nivel_edu ORDER BY cod_nivel ASC'),
            pool.query('SELECT cod_categoria AS id, categoria AS nombre, tipo_trabajador FROM categoria ORDER BY cod_categoria ASC'),
            pool.query('SELECT cod_estado AS id, estado AS nombre FROM estado ORDER BY cod_estado ASC'),
            pool.query('SELECT cod_ley AS id, ley AS nombre FROM ley ORDER BY cod_ley ASC'),
            pool.query('SELECT cod_distrito AS id, distrito AS nombre FROM distrito ORDER BY distrito ASC'),
            pool.query('SELECT cod_mod AS id, institucion AS nombre FROM institucion ORDER BY institucion ASC')
        ]);
        res.json({
            ok: true,
            data: {
                cargos,
                tipos,
                subtipos,
                niveles,
                categorias,
                estados,
                leyes,
                distritos,
                instituciones
            }
        });
    } catch (error) {
        console.error('Error fetching catalogos trabajador:', error);
        res.status(500).json({ ok: false, message: 'Error interno al obtener catálogos' });
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
                i.institucion AS institucion_nombre,
                t.jornada AS horas_jornada,
                DATE_FORMAT(t.fecha_inicio, '%Y-%m-%d') AS fecha_inicio,
                DATE_FORMAT(t.fecha_final, '%Y-%m-%d') AS fecha_final,
                t.categoria AS id_categoria,
                cat.categoria AS categoria_nombre,
                t.ley AS id_ley,
                l.ley AS ley_nombre,
                t.estado AS id_estado_laboral,
                e.estado AS estado_nombre,
                t.cargo_trabajador AS id_cargo,
                c.cargo_trabajador AS cargo_nombre,
                t.tipo_trabajador AS id_tipo_trabajador,
                tt.tipo_trabajador AS tipo_trabajador_nombre,
                t.subtipo_trabajador AS id_subtipo_trabajador,
                st.subtipo_trabajador AS subtipo_trabajador_nombre,
                t.nivel_edu AS id_nivel_educativo,
                n.nivel AS nivel_nombre,
                t.distrito AS id_distrito,
                d.distrito AS distrito_nombre,
                t.cod_trabajador AS id_historial
            FROM trabajador t
            LEFT JOIN nivel_edu n ON t.nivel_edu = n.cod_nivel
            LEFT JOIN tipo_trabajador tt ON t.tipo_trabajador = tt.cod_tipo
            LEFT JOIN subtipo_trabajador st ON t.subtipo_trabajador = st.cod_subtipo
            LEFT JOIN cargo_trabajador c ON t.cargo_trabajador = c.cod_cargo
            LEFT JOIN categoria cat ON t.categoria = cat.cod_categoria
            LEFT JOIN estado e ON t.estado = e.cod_estado
            LEFT JOIN ley l ON t.ley = l.cod_ley
            LEFT JOIN distrito d ON t.distrito = d.cod_distrito
            LEFT JOIN institucion i ON t.institucion = i.cod_mod
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

const createTrabajador = async (req, res) => {
    const data = req.body;
    try {
        const query = `
            INSERT INTO trabajador (
                dni, ape_pat, ape_mat, nombres, cod_plaza, 
                nivel_edu, tipo_trabajador, subtipo_trabajador, 
                cargo_trabajador, categoria, estado, ley, 
                distrito, institucion, jornada, fecha_inicio, fecha_final
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [
            data.dni, data.ape_pat, data.ape_mat, data.nombres, data.cod_plaza,
            data.id_nivel_educativo || data.nivel || 1, 
            data.id_tipo_trabajador || data.tipo_trabajador || 1, 
            data.id_subtipo_trabajador || data.subtipo_trabajador || 1,
            data.id_cargo || data.cargo || 1, 
            data.id_categoria || data.categoria || 1, 
            data.id_estado_laboral || data.estado || 1, 
            data.id_ley || data.ley || 1,
            data.id_distrito || data.distrito || 1, 
            data.cod_mod_institucion || data.institucion, 
            data.horas_jornada, 
            data.fecha_inicio || null, 
            data.fecha_final || null
        ]);
        res.json({ ok: true, message: 'Trabajador registrado' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno al registrar trabajador' });
    }
};

const updateTrabajador = async (req, res) => {
    const { dni } = req.params;
    const data = req.body;
    try {
        const query = `
            UPDATE trabajador SET 
                ape_pat=?, ape_mat=?, nombres=?, cod_plaza=?, 
                nivel_edu=?, tipo_trabajador=?, subtipo_trabajador=?, 
                cargo_trabajador=?, categoria=?, estado=?, ley=?, 
                distrito=?, institucion=?, jornada=?, fecha_inicio=?, fecha_final=?
            WHERE dni=?
        `;
        await pool.query(query, [
            data.ape_pat, data.ape_mat, data.nombres, data.cod_plaza,
            data.id_nivel_educativo || data.nivel || 1, 
            data.id_tipo_trabajador || data.tipo_trabajador || 1, 
            data.id_subtipo_trabajador || data.subtipo_trabajador || 1,
            data.id_cargo || data.cargo || 1, 
            data.id_categoria || data.categoria || 1, 
            data.id_estado_laboral || data.estado || 1, 
            data.id_ley || data.ley || 1,
            data.id_distrito || data.distrito || 1, 
            data.cod_mod_institucion || data.institucion, 
            data.horas_jornada, 
            data.fecha_inicio || null, 
            data.fecha_final || null,
            dni
        ]);
        res.json({ ok: true, message: 'Trabajador actualizado' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno al actualizar trabajador' });
    }
};

const deleteTrabajador = async (req, res) => {
    const { dni } = req.params;
    try {
        await pool.query('DELETE FROM trabajador WHERE dni = ?', [dni]);
        res.json({ ok: true, message: 'Trabajador eliminado' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ ok: false, message: 'Error interno al eliminar trabajador' });
    }
};

module.exports = {
    getTrabajadores,
    getCargos,
    getCatalogosTrabajador,
    getTrabajadorByDni,
    createTrabajador,
    updateTrabajador,
    deleteTrabajador
};
