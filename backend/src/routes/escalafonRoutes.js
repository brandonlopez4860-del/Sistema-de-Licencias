const { Router } = require('express');
const { getLicencias, getTrabajadorByDni, registrarLicencia, actualizarLicencia, eliminarLicencia } = require('../controllers/escalafonController');

const router = Router();

// GET /api/escalafon/consultas
router.get('/consultas', getLicencias);

// GET /api/escalafon/trabajador/:dni
router.get('/trabajador/:dni', getTrabajadorByDni);

// POST /api/escalafon/licencia
router.post('/licencia', registrarLicencia);

// PUT /api/escalafon/licencia/:codigo
router.put('/licencia/:codigo', actualizarLicencia);

// DELETE /api/escalafon/licencia/:codigo
router.delete('/licencia/:codigo', eliminarLicencia);

module.exports = router;
