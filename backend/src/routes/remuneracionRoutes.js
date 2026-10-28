const express = require('express');
const router = express.Router();
const { 
    getRemuneraciones, 
    getCatalogos, 
    registrarRemuneracion, 
    actualizarRemuneracion, 
    eliminarRemuneracion 
} = require('../controllers/remuneracionController');

router.get('/consultas', getRemuneraciones);
router.get('/catalogos', getCatalogos);
router.post('/licencia', registrarRemuneracion);
router.put('/licencia/:codigo', actualizarRemuneracion);
router.delete('/licencia/:codigo', eliminarRemuneracion);

module.exports = router;
