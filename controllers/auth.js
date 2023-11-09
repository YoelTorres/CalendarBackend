const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async (req, res = response) => {

    const { email, password } = req.body;
    
    try {
        let usuario = await Usuario.findOne({email});
       
        if(usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario con ese email ya existe'
            });
        }
        usuario = new Usuario(req.body);

        // * Encriptar contraseña
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync( password, salt );

        await usuario.save();

        // * Genera JSON WebTokens
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
}

const loginUsuario = async(req, res = response) => {

    const { email, password } = req.body;

    try {
        const usuario = await Usuario.findOne({email});
       
        if( !usuario ) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario incorrecto'
            });
        }

        // * Confirmar password
        const validPassword = bcrypt.compareSync( password, usuario.password );
        if( !validPassword ) {
            return res.status(400).json({
                ok: false,
                msg: 'Contraseña incorrecto'
            });
        }

        // * Genera JSON WebTokens
        const token = await generarJWT( usuario.id, usuario.name );

        res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        });
    } catch (error) {
        console.error(error.message);
        res.status(500).json({
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
    }
};

const revalidarToken = async(req, res = response) => {

    const name = req.name;

    const usuario = await Usuario.findOne({name});
    // * Genera JSON WebTokens
    const token = await generarJWT( usuario.id, usuario.name );

    res.status(200).json({
        ok: true,
        uid: usuario.id, 
        name: usuario.name,
        token
    });
};

module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}