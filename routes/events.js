/* 
    * Rutas de Eventos
    * HOST + /api/events
    ! Todos tienen que pasar por la validación JWT. 
*/

const { Router } = require('express');
const { check } = require('express-validator');
const { validarCampos } = require('../middlewares/validar-campos');
const { validarJWT } = require('../middlewares/validar-jwt');

const { actualizarEvento, crearEvento, eliminarEvento, getEventos } = require('../controllers/events');
const { isDate } = require('../helpers/isDate');
const router = Router();

/**
 * ! Middleware: Valida todos los eventos.
 */
router.use(validarJWT);

/**
 * * Obtener eventos.
*/
router.get('/', getEventos);

/**
 * * Crear un nuevo evento
*/
router.post('/',
    [
        check('title', 'El titulo es obligatorio').not().isEmpty(),
        check('start', 'Fecha de inicio es obligatoria').custom( isDate ),
        check('end', 'Fecha de fin es obligatoria').custom( isDate ),
        validarCampos
    ],
    crearEvento);

/**
 * * Actualizar evento
 * @param id Id del evento.
*/
router.put('/:id', actualizarEvento);

/**
 * * Borrar evento
 * @param id Id del evento.
*/
router.delete('/:id', eliminarEvento);

module.exports = router;