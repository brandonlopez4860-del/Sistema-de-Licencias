const pool = require('../config/db');

const getRemuneraciones = async (req, res) => {
    try {
        const query = `
            SELECT 
              r.rem_exp AS codigo,
              r.rem_exp AS expediente,
              r.rem_dni AS dni,
              r.rem_ape_pat AS apePat,
              r.rem_ape_mat AS apeMat,
              r.rem_nombres AS nombres,
              CONCAT(COALESCE(r.rem_nombres, t.nombres, ''), ' ', COALESCE(r.rem_ape_pat, t.ape_pat, ''), ' ', COALESCE(r.rem_ape_mat, t.ape_mat, '')) AS trabajador,
              COALESCE(r.rem_colegio, i.institucion, t.institucion) AS colegio,
              COALESCE(r.rem_colegio, i.institucion, t.institucion) AS institucion,
              DATE_FORMAT(r.rem_registro, '%d/%m/%Y') AS registro,
              DATE_FORMAT(r.rem_inicio, '%d/%m/%Y') AS inicio,
              DATE_FORMAT(r.rem_fin, '%d/%m/%Y') AS final,
              r.rem_total AS dias,
              
              -- Llave foránea Permiso
              r.permiso AS id_permiso,
              COALESCE(p.nom_permiso, CAST(r.permiso AS CHAR), 'NINGUNO') AS permiso,
              r.rem_cod_permiso AS cPermiso,

              -- Llave foránea Tipo Permiso
              r.tipo_permiso AS id_tipo_permiso,
              COALESCE(tp.nom_tipo_permiso, CAST(r.tipo_permiso AS CHAR), 'NINGUNO') AS tPermiso,

              -- Llave foránea Subsidio
              r.rem_subcidio AS codigo_rem,
              r.rem_subcidio AS id_subsidio,
              COALESCE(sc.subcicio, CAST(r.rem_subcidio AS CHAR)) AS subsidio,

              r.rem_dias AS n_dias_rem,
              r.rem_pendientes AS pendientes_rem,
              r.rem_exp_dias AS exp_dias_rem,

              -- Llaves foráneas vinculadas: Tipo Trabajador, Subtipo, Cargo, Categoria
              COALESCE(tt.tipo_trabajador, r.rem_tipo_trabajador, '-') AS tipoTrabajador,
              COALESCE(st.subtipo_trabajador, r.rem_subtipo_trabajador, '-') AS subTipo,
              COALESCE(ct.cargo_trabajador, r.rem_cargo_trabajador, '-') AS cargo,
              COALESCE(ca.categoria, r.rem_categoria, '-') AS categoria
            FROM remunerciones r
            LEFT JOIN trabajador t ON t.cod_trabajador = r.rem_trabajador
            LEFT JOIN tipo_trabajador tt ON tt.cod_tipo = t.tipo_trabajador
            LEFT JOIN subtipo_trabajador st ON st.cod_subtipo = t.subtipo_trabajador
            LEFT JOIN cargo_trabajador ct ON ct.cod_cargo = t.cargo_trabajador
            LEFT JOIN categoria ca ON ca.cod_categoria = t.categoria
            LEFT JOIN institucion i ON i.cod_mod = t.institucion
            LEFT JOIN permiso p ON p.cod_permiso = r.permiso
            LEFT JOIN tipo_permiso tp ON tp.cod_tipo_permiso = r.tipo_permiso
            LEFT JOIN subcidio sc ON sc.cod_subcidio = r.rem_subcidio
            ORDER BY r.rem_registro DESC;
        `;
        const [rows] = await pool.query(query);
        res.json({ ok: true, data: rows });
    } catch (error) {
        console.error('Error fetching remuneraciones:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const getCatalogos = async (req, res) => {
    try {
        const [[permisos], [tiposPermiso], [subsidios]] = await Promise.all([
            pool.query('SELECT cod_permiso AS id, nom_permiso AS nombre FROM permiso ORDER BY cod_permiso'),
            pool.query('SELECT cod_tipo_permiso AS id, nom_tipo_permiso AS nombre FROM tipo_permiso ORDER BY cod_tipo_permiso'),
            pool.query('SELECT cod_subcidio AS id, subcicio AS nombre FROM subcidio ORDER BY cod_subcidio')
        ]);
        res.json({ ok: true, data: { permisos, tiposPermiso, subsidios } });
    } catch (error) {
        console.error('Error fetching catalogos:', error);
        res.status(500).json({ ok: false, message: 'Error interno al obtener catálogos' });
    }
};

const resolverIdPermiso = (sustento) => {
    if (!sustento || sustento === 'SELECCIONA') return 6; // NINGUNO
    if (!isNaN(sustento)) return Number(sustento);
    const s = String(sustento).toUpperCase().trim();
    if (s === 'CITT') return 1;
    if (s.includes('PARTICULAR') || s === 'CMP') return 2;
    if (s.includes('LEY 30012')) return 3;
    if (s.includes('NACIMIENTO')) return 4;
    if (s.includes('DEFUNCION')) return 5;
    if (s.includes('RESOLUCIÓN') || s.includes('RESOLUCION') || s === 'NINGUNO') return 6;
    return 6;
};

const resolverIdTipoPermiso = (tipo) => {
    if (!tipo || tipo === 'SELECCIONA') return 1;
    if (!isNaN(tipo)) return Number(tipo);
    const t = String(tipo).toUpperCase().trim();
    if (t.includes('ONCOLOGICA') || t.includes('ODONTOLOGICA')) return 2;
    if (t.includes('GRAVE')) return 3;
    if (t.includes('HOSPITALIZACION') || t.includes('HOSPITALIZACIÓN')) return 4;
    if (t.includes('MATERNIDAD')) return 5;
    if (t.includes('PATERNIDAD')) return 6;
    if (t.includes('LUTO') || t.includes('SEPELIO')) return 7;
    if (t.includes('REGULARIZAR')) return 8;
    if (t.includes('ENFERMEDAD')) return 1;
    return 1;
};

const resolverIdSubsidio = (codigoRem) => {
    if (!codigoRem || codigoRem === 'SELECCIONA') return 1;
    if (!isNaN(codigoRem)) return Number(codigoRem);
    const c = String(codigoRem).toLowerCase();
    if (c.includes('22') || c.includes('mat')) return 2;
    return 1;
};

const registrarRemuneracion = async (req, res) => {
    const { 
        id_trabajador,
        fecha_registro,
        inicio_descanso,
        fin_descanso,
        dias,
        sustento,
        codigo_permiso,
        tipo_permiso,
        codigo_rem,
        n_dias_rem,
        pendientes_rem,
        exp_dias_rem
    } = req.body;

    try {
        const [tRows] = await pool.query(`
            SELECT 
                t.*,
                COALESCE(i.institucion, t.institucion) AS colegio_nombre,
                tt.tipo_trabajador AS tipo_nombre,
                st.subtipo_trabajador AS subtipo_nombre,
                ct.cargo_trabajador AS cargo_nombre,
                cat.categoria AS categoria_nombre
            FROM trabajador t
            LEFT JOIN institucion i ON i.cod_mod = t.institucion
            LEFT JOIN tipo_trabajador tt ON tt.cod_tipo = t.tipo_trabajador
            LEFT JOIN subtipo_trabajador st ON st.cod_subtipo = t.subtipo_trabajador
            LEFT JOIN cargo_trabajador ct ON ct.cod_cargo = t.cargo_trabajador
            LEFT JOIN categoria cat ON cat.cod_categoria = t.categoria
            WHERE t.cod_trabajador = ?
        `, [id_trabajador]);

        if (tRows.length === 0) {
            return res.status(404).json({ ok: false, message: 'Trabajador no encontrado' });
        }
        const t = tRows[0];

        const nro_expediente = Math.floor(1000 + Math.random() * 90000);
        const p_val = resolverIdPermiso(sustento);
        const tp_val = resolverIdTipoPermiso(tipo_permiso);
        const sub_val = resolverIdSubsidio(codigo_rem);

        await pool.query(
            `INSERT INTO remunerciones 
            (rem_exp, rem_trabajador, rem_dni, rem_ape_pat, rem_ape_mat, rem_nombres, 
             rem_tipo_trabajador, rem_subtipo_trabajador, rem_cargo_trabajador, rem_categoria, rem_colegio, 
             rem_registro, rem_inicio, rem_fin, rem_total, permiso, rem_cod_permiso, tipo_permiso,
             rem_dias, rem_pendientes, rem_subcidio, rem_exp_dias)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                nro_expediente, 
                id_trabajador, 
                t.dni, 
                t.ape_pat, 
                t.ape_mat, 
                t.nombres,
                t.tipo_nombre || t.tipo_trabajador, 
                t.subtipo_nombre || t.subtipo_trabajador, 
                t.cargo_nombre || t.cargo_trabajador, 
                t.categoria_nombre || t.categoria, 
                t.colegio_nombre || t.institucion,
                fecha_registro, 
                inicio_descanso, 
                fin_descanso, 
                dias, 
                p_val, 
                codigo_permiso, 
                tp_val,
                n_dias_rem || null, 
                pendientes_rem || null, 
                sub_val, 
                exp_dias_rem
            ]
        );

        res.json({ ok: true, message: 'Remuneración registrada exitosamente' });
    } catch (error) {
        console.error('Error al registrar remuneracion:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const actualizarRemuneracion = async (req, res) => {
    const { codigo } = req.params; 
    const { 
        id_trabajador,
        fecha_registro,
        inicio_descanso,
        fin_descanso,
        dias,
        sustento,
        codigo_permiso,
        tipo_permiso,
        codigo_rem,
        n_dias_rem,
        pendientes_rem,
        exp_dias_rem
    } = req.body;

    try {
        const p_val = resolverIdPermiso(sustento);
        const tp_val = resolverIdTipoPermiso(tipo_permiso);
        const sub_val = resolverIdSubsidio(codigo_rem);

        // Si se envió un trabajador nuevo para re-vincular
        if (id_trabajador) {
            const [tRows] = await pool.query(`
                SELECT 
                    t.*,
                    COALESCE(i.institucion, t.institucion) AS colegio_nombre,
                    tt.tipo_trabajador AS tipo_nombre,
                    st.subtipo_trabajador AS subtipo_nombre,
                    ct.cargo_trabajador AS cargo_nombre,
                    cat.categoria AS categoria_nombre
                FROM trabajador t
                LEFT JOIN institucion i ON i.cod_mod = t.institucion
                LEFT JOIN tipo_trabajador tt ON tt.cod_tipo = t.tipo_trabajador
                LEFT JOIN subtipo_trabajador st ON st.cod_subtipo = t.subtipo_trabajador
                LEFT JOIN cargo_trabajador ct ON ct.cod_cargo = t.cargo_trabajador
                LEFT JOIN categoria cat ON cat.cod_categoria = t.categoria
                WHERE t.cod_trabajador = ?
            `, [id_trabajador]);

            if (tRows.length > 0) {
                const t = tRows[0];
                await pool.query(
                    `UPDATE remunerciones
                     SET rem_trabajador=?, rem_dni=?, rem_ape_pat=?, rem_ape_mat=?, rem_nombres=?,
                         rem_tipo_trabajador=?, rem_subtipo_trabajador=?, rem_cargo_trabajador=?, rem_categoria=?, rem_colegio=?,
                         rem_registro=?, rem_inicio=?, rem_fin=?, rem_total=?, permiso=?, rem_cod_permiso=?, tipo_permiso=?,
                         rem_dias=?, rem_pendientes=?, rem_subcidio=?, rem_exp_dias=?
                     WHERE rem_exp=?`,
                    [
                        id_trabajador, t.dni, t.ape_pat, t.ape_mat, t.nombres,
                        t.tipo_nombre || t.tipo_trabajador, t.subtipo_nombre || t.subtipo_trabajador,
                        t.cargo_nombre || t.cargo_trabajador, t.categoria_nombre || t.categoria,
                        t.colegio_nombre || t.institucion,
                        fecha_registro, inicio_descanso, fin_descanso, dias, p_val, codigo_permiso, tp_val,
                        n_dias_rem || null, pendientes_rem || null, sub_val, exp_dias_rem, codigo
                    ]
                );
                return res.json({ ok: true, message: 'Remuneración actualizada exitosamente' });
            }
        }

        await pool.query(
            `UPDATE remunerciones
             SET rem_registro=?, rem_inicio=?, rem_fin=?, rem_total=?, permiso=?, rem_cod_permiso=?, tipo_permiso=?,
                 rem_dias=?, rem_pendientes=?, rem_subcidio=?, rem_exp_dias=?
             WHERE rem_exp=?`,
            [
                fecha_registro, inicio_descanso, fin_descanso, dias, p_val, codigo_permiso, tp_val,
                n_dias_rem || null, pendientes_rem || null, sub_val, exp_dias_rem, codigo
            ]
        );

        res.json({ ok: true, message: 'Remuneración actualizada exitosamente' });
    } catch (error) {
        console.error('Error al actualizar remuneracion:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

const eliminarRemuneracion = async (req, res) => {
    const { codigo } = req.params;
    try {
        await pool.query('DELETE FROM remunerciones WHERE rem_exp = ?', [codigo]);
        res.json({ ok: true, message: 'Remuneración eliminada exitosamente' });
    } catch (error) {
        console.error('Error al eliminar remuneracion:', error);
        res.status(500).json({ ok: false, message: 'Error interno del servidor' });
    }
};

module.exports = {
    getRemuneraciones,
    getCatalogos,
    registrarRemuneracion,
    actualizarRemuneracion,
    eliminarRemuneracion
};
