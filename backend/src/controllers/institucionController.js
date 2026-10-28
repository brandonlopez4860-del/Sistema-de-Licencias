const pool = require('../config/db');

const getInstituciones = async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT 
                i.cod_mod, 
                i.institucion AS nombre, 
                i.distrito AS id_distrito,
                COALESCE(d.distrito, '') AS distrito_nombre,
                i.zona AS id_zona, 
                COALESCE(z.zona, '') AS zona_nombre,
                i.gestion AS id_gestion, 
                COALESCE(g.gestion, '') AS gestion_nombre,
                IF(i.eib = 'SI', 1, 0) AS es_eib,
                i.tipo_institucion,
                COALESCE(ti.tipo_institucion, '') AS tipo_institucion_nombre
             FROM institucion i
             LEFT JOIN distrito d ON i.distrito = d.cod_distrito
             LEFT JOIN zona z ON i.zona = z.cod_zona
             LEFT JOIN gestion g ON i.gestion = g.cod_gestion
             LEFT JOIN tipo_institucion ti ON i.tipo_institucion = ti.cod_tipo_institucion
             ORDER BY i.institucion ASC`
        );
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error('Error al obtener instituciones:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const getCatalogosInstitucion = async (req, res) => {
    try {
        const [
            [zonas],
            [gestiones],
            [distritos],
            [tiposInstitucion]
        ] = await Promise.all([
            pool.query('SELECT cod_zona AS id, zona AS nombre FROM zona ORDER BY cod_zona ASC'),
            pool.query('SELECT cod_gestion AS id, gestion AS nombre FROM gestion ORDER BY cod_gestion ASC'),
            pool.query('SELECT cod_distrito AS id, distrito AS nombre FROM distrito ORDER BY distrito ASC'),
            pool.query('SELECT cod_tipo_institucion AS id, tipo_institucion AS nombre FROM tipo_institucion ORDER BY cod_tipo_institucion ASC')
        ]);
        res.json({
            ok: true,
            data: {
                zonas,
                gestiones,
                distritos,
                tiposInstitucion
            }
        });
    } catch (error) {
        console.error('Error fetching catalogos institucion:', error);
        res.status(500).json({ ok: false, message: 'Error interno al obtener catálogos de institución' });
    }
};

const createInstitucion = async (req, res) => {
    const { cod_mod, nombre, id_distrito, id_zona, id_gestion, es_eib, tipo_institucion } = req.body;
    try {
        const eib_val = es_eib ? 'SI' : 'NO';
        const tipo_inst_val = parseInt(tipo_institucion) || 1;

        const query = `
            INSERT INTO institucion (cod_mod, institucion, distrito, zona, gestion, eib, tipo_institucion)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await pool.query(query, [
            cod_mod, 
            nombre, 
            parseInt(id_distrito) || 1, 
            parseInt(id_zona) || 1, 
            parseInt(id_gestion) || 1, 
            eib_val, 
            tipo_inst_val
        ]);
        res.json({ ok: true, message: 'Institución registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar institución:', error);
        res.status(500).json({ ok: false, message: 'Error al registrar institución' });
    }
};

const updateInstitucion = async (req, res) => {
    const { cod_mod } = req.params;
    const { nombre, id_distrito, id_zona, id_gestion, es_eib, tipo_institucion } = req.body;
    try {
        const eib_val = es_eib ? 'SI' : 'NO';
        const tipo_inst_val = parseInt(tipo_institucion) || 1;

        const query = `
            UPDATE institucion 
            SET institucion = ?, distrito = ?, zona = ?, gestion = ?, eib = ?, tipo_institucion = ?
            WHERE cod_mod = ?
        `;
        await pool.query(query, [
            nombre, 
            parseInt(id_distrito) || 1, 
            parseInt(id_zona) || 1, 
            parseInt(id_gestion) || 1, 
            eib_val, 
            tipo_inst_val, 
            cod_mod
        ]);
        res.json({ ok: true, message: 'Institución actualizada' });
    } catch (error) {
        console.error('Error al actualizar institución:', error);
        res.status(500).json({ ok: false, message: 'Error al actualizar institución' });
    }
};

const deleteInstitucion = async (req, res) => {
    const { cod_mod } = req.params;
    try {
        await pool.query('DELETE FROM institucion WHERE cod_mod = ?', [cod_mod]);
        res.json({ ok: true, message: 'Institución eliminada' });
    } catch (error) {
        console.error('Error al eliminar institución:', error);
        res.status(500).json({ ok: false, message: 'Error al eliminar institución' });
    }
};

module.exports = {
    getInstituciones,
    getCatalogosInstitucion,
    createInstitucion,
    updateInstitucion,
    deleteInstitucion
};
