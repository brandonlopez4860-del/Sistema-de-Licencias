const pool = require('../config/db');

const getDashboardStats = async (req, res) => {
    try {
        const { period, month } = req.query; // period='2026', month='Todos' o '1', '2'...

        const [instituciones] = await pool.query('SELECT COUNT(*) as count FROM institucion');
        const [trabajadores] = await pool.query('SELECT COUNT(*) as count FROM trabajador');
        const [escalafon] = await pool.query('SELECT COUNT(*) as count FROM escalafon');
        const [remuneraciones] = await pool.query('SELECT COUNT(*) as count FROM remunerciones');
        
        // --- 0. Obtener años disponibles ---
        const availableYearsQuery = `
            SELECT DISTINCT YEAR(fecha) as year FROM (
                SELECT esc_registro as fecha FROM escalafon WHERE esc_registro IS NOT NULL
                UNION
                SELECT rem_registro as fecha FROM remunerciones WHERE rem_registro IS NOT NULL
            ) as fechas
            ORDER BY year DESC
        `;
        const [yearsResult] = await pool.query(availableYearsQuery);
        const availableYears = yearsResult.map(row => row.year.toString());

        // --- 1. Generar dataLine: Días de licencia de escalafón y remuneración ---
        let targetYear = period;
        if (!targetYear || !/^\d{4}$/.test(targetYear)) {
            targetYear = availableYears.length > 0 ? availableYears[0] : new Date().getFullYear().toString();
        }
        
        let isMonthSelected = month && month !== 'Todos';
        let targetMonth = isMonthSelected ? parseInt(month, 10) : null;

        let dataLineQuery = '';
        let dataLineRaw = [];
        let dataLineResult = [];
        
        let escalafonAnualResult, remuneracionAnualResult;

        if (isMonthSelected) {
            // Agrupar por DÍA del mes seleccionado
            dataLineQuery = `
                SELECT 
                    DATE_FORMAT(fecha, '%d') as day_num,
                    SUM(escalafon_count) as escalafon,
                    SUM(remuneracion_count) as remuneracion
                FROM (
                    SELECT esc_registro as fecha, IFNULL(esc_total, 0) as escalafon_count, 0 as remuneracion_count
                    FROM escalafon
                    WHERE esc_registro IS NOT NULL AND YEAR(esc_registro) = ? AND MONTH(esc_registro) = ?
                    UNION ALL
                    SELECT rem_registro as fecha, 0 as escalafon_count, IFNULL(rem_total, 0) as remuneracion_count
                    FROM remunerciones
                    WHERE rem_registro IS NOT NULL AND YEAR(rem_registro) = ? AND MONTH(rem_registro) = ?
                ) as combined
                GROUP BY day_num
                ORDER BY day_num ASC
            `;
            [dataLineRaw] = await pool.query(dataLineQuery, [targetYear, targetMonth, targetYear, targetMonth]);
            
            // Llenar los días del mes (excluyendo fines de semana)
            const daysInMonth = new Date(targetYear, targetMonth, 0).getDate();
            for (let i = 1; i <= daysInMonth; i++) {
                // Verificar si es fin de semana (0 = Domingo, 6 = Sábado)
                const date = new Date(targetYear, targetMonth - 1, i);
                const dayOfWeek = date.getDay();
                if (dayOfWeek === 0 || dayOfWeek === 6) {
                    continue; // Saltar sábados y domingos
                }

                const dayStr = i.toString().padStart(2, '0');
                const found = dataLineRaw.find(d => d.day_num === dayStr);
                dataLineResult.push({
                    name: i.toString(), // Día (1, 2, 3...)
                    escalafon: found ? Number(found.escalafon) : 0,
                    remuneracion: found ? Number(found.remuneracion) : 0
                });
            }

            // Totales filtrados por mes
            [escalafonAnualResult] = await pool.query('SELECT COUNT(*) as count FROM escalafon WHERE YEAR(esc_registro) = ? AND MONTH(esc_registro) = ?', [targetYear, targetMonth]);
            [remuneracionAnualResult] = await pool.query('SELECT COUNT(*) as count FROM remunerciones WHERE YEAR(rem_registro) = ? AND MONTH(rem_registro) = ?', [targetYear, targetMonth]);

        } else {
            // Agrupar por MES del año seleccionado
            dataLineQuery = `
                SELECT 
                    DATE_FORMAT(fecha, '%m') as month_num,
                    SUM(escalafon_count) as escalafon,
                    SUM(remuneracion_count) as remuneracion
                FROM (
                    SELECT esc_registro as fecha, IFNULL(esc_total, 0) as escalafon_count, 0 as remuneracion_count
                    FROM escalafon
                    WHERE esc_registro IS NOT NULL AND YEAR(esc_registro) = ?
                    UNION ALL
                    SELECT rem_registro as fecha, 0 as escalafon_count, IFNULL(rem_total, 0) as remuneracion_count
                    FROM remunerciones
                    WHERE rem_registro IS NOT NULL AND YEAR(rem_registro) = ?
                ) as combined
                GROUP BY month_num
                ORDER BY month_num ASC
            `;
            [dataLineRaw] = await pool.query(dataLineQuery, [targetYear, targetYear]);
            
            const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
            dataLineResult = monthNames.map((monthName, index) => {
                const monthStr = (index + 1).toString().padStart(2, '0');
                const found = dataLineRaw.find(d => d.month_num === monthStr);
                return {
                    name: monthName,
                    escalafon: found ? Number(found.escalafon) : 0,
                    remuneracion: found ? Number(found.remuneracion) : 0
                };
            });

            // Totales de todo el año
            [escalafonAnualResult] = await pool.query('SELECT COUNT(*) as count FROM escalafon WHERE YEAR(esc_registro) = ?', [targetYear]);
            [remuneracionAnualResult] = await pool.query('SELECT COUNT(*) as count FROM remunerciones WHERE YEAR(rem_registro) = ?', [targetYear]);
        }
        
        const registrosEscalafonAnual = escalafonAnualResult[0].count;
        const registrosRemuneracionAnual = remuneracionAnualResult[0].count;

        // --- 2. Generar dataPago: Con Goce vs Sin Goce ---
        const dataPago = [
          { name: 'Ene', conGoce: 120, sinGoce: 45 },
          { name: 'Feb', conGoce: 150, sinGoce: 30 },
          { name: 'Mar', conGoce: 180, sinGoce: 60 }
        ];

        // --- 3. Generar dataSustento ---
        const dataSustentoQuery = `
            SELECT 
                CASE 
                    WHEN permiso = 1 THEN 'CITT' 
                    WHEN permiso = 2 THEN 'CERTIFICADO_PARTICULAR' 
                    ELSE 'Ninguno' 
                END as name,
                COUNT(*) as value
            FROM escalafon
            GROUP BY permiso
        `;
        const [dataSustentoResult] = await pool.query(dataSustentoQuery);

        res.json({
            success: true, 
            ok: true,
            data: {
                totalInstituciones: instituciones[0].count,
                totalTrabajadores: trabajadores[0].count,
                totalEscalafon: escalafon[0].count,
                totalRemuneraciones: remuneraciones[0].count
            },
            availableYears: availableYears,
            targetYear: targetYear,
            chartStats: {
                escalafon: registrosEscalafonAnual,
                remuneracion: registrosRemuneracionAnual
            },
            dataLine: dataLineResult,
            dataPago: dataPago,
            dataSustento: dataSustentoResult.length > 0 ? dataSustentoResult : [{ name: 'Ninguno', value: 100 }]
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ ok: false, success: false, message: 'Error interno del servidor' });
    }
};

module.exports = { getDashboardStats };
