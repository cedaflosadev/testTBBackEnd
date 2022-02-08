/* 
    RUTAS DE USUARIOS O AUTH 
    host+/api/auth
*/
const { Router } = require('express');
const { check } = require('express-validator') //middleware de validacion 
const { crearUsuario, login, renewToken } = require('../controllers/auth');
const { ValidarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const router = Router();

router.post(
    '/new',
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').not().isEmpty().isEmail(),
        check('password', 'El password es obligatorio   ').not().isEmpty().isLength({ min: 6 }),
        ValidarCampos
    ],
    crearUsuario);
router.post('/',
    [
        check('email', 'El email es obligatorio').not().isEmpty().isEmail(),
        check('password', 'El password es obligatorio   ').not().isEmpty().isLength({ min: 6 }),
        ValidarCampos
    ], login);
router.get('/renew', validarJWT, renewToken);


module.exports = router;