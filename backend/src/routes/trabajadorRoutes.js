const { Router } = require('express');
const { 
    getTrabajadores, 
    getCargos,
    getCatalogosTrabajador,
    getTrabajadorByDni, 
    createTrabajador, 
    updateTrabajador, 
    deleteTrabajador 
} = require('../controllers/trabajadorController');

const router = Router();

router.get('/', getTrabajadores);
router.get('/cargos', getCargos);
router.get('/catalogos', getCatalogosTrabajador);
router.get('/:dni', getTrabajadorByDni);
router.post('/', createTrabajador);
router.put('/:dni', updateTrabajador);
router.delete('/:dni', deleteTrabajador);

module.exports = router;
