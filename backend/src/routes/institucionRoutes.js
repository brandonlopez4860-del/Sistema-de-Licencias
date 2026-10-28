const { Router } = require('express');
const { 
    getInstituciones, 
    getCatalogosInstitucion,
    createInstitucion, 
    updateInstitucion, 
    deleteInstitucion 
} = require('../controllers/institucionController');

const router = Router();

router.get('/', getInstituciones);
router.get('/catalogos', getCatalogosInstitucion);
router.post('/', createInstitucion);
router.put('/:cod_mod', updateInstitucion);
router.delete('/:cod_mod', deleteInstitucion);

module.exports = router;
