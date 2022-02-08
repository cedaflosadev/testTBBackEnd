
// Obtener eventos, pasar validacion del token

/* Event Routes
/api/events
 */
const { Router } = require('express');
const { validarJWT } = require('../middlewares/validar-jwt')
const { getEventos, createEventos, updateEventos, deleteEventos } = require('../controllers/events');
const { check } = require('express-validator');
const { ValidarCampos } = require('../middlewares/validar-campos');
const { isDate } = require('../helpers/isDate');


const router = Router();

// todas las peticiones pasan por validar token
router.use(validarJWT);

router.get('/', getEventos)
router.post('/', [check('title', 'El titulo es obligatorio').not().isEmpty()
    , check('start', 'Fecha de inicio es obligatoria').custom(isDate)
    , check('end', 'Fecha de finalización es obligatoria').custom(isDate)
    , ValidarCampos], createEventos)
router.put('/:id', updateEventos)
router.delete('/:id', deleteEventos)


module.exports = router;
