/* 
    * Rutas de Auth
    * HOST + /api/auth

*/

const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');
const router = Router();

router.post(
    '/new', 
    // TODO: middlewares
    [
        check('name', 'El nombre es obligatorio').not().isEmpty(),
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser mayor de 6 carácteres').isLength({ min: 6}),
        validarCampos
    ], 
    crearUsuario);

router.post(
    '/',
    // TODO: middlewares
    [
        check('email', 'El email es obligatorio').isEmail(),
        check('password', 'El password debe ser mayor de 6 carácteres').isLength({ min: 6}),
        validarCampos
    ], 
    loginUsuario);

router.get(
    '/renew',
    // TODO: middlewares
        validarJWT
    ,
     revalidarToken);

module.exports = router;