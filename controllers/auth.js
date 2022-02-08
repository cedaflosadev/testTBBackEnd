const { response } = require('express');
const bcrypt = require('bcryptjs');
const Usuario = require('../models/Usuario');
const { generarJWT } = require('../helpers/jwt');

const errorMessage = () => {
    return res.status(500).json({
        ok: false,
        msg: 'Por Favor hable con el administrador'
    })
}

const crearUsuario = async (req, res = response) => {
    const { email, password } = req.body
    try {
        let usuario = await Usuario.findOne({ email });
        if (usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Un usuario existe con este correo '
            })
        }

        usuario = new Usuario(req.body);
        //ENCRIPTAR CONSTRASÑEA
        const salt = bcrypt.genSaltSync();
        usuario.password = bcrypt.hashSync(password, salt)
        /** */
        await usuario.save();

        //Generar nuestros jwt
        const token = await generarJWT(usuario.id, usuario.name)
        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })

    } catch (error) {
        errorMessage();
    }

}

const login = async (req, res = response) => {

    const { email, password } = req.body

    try {
        let usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({
                ok: false,
                msg: 'Usuario y Contraseña no son correctos '
            })
        }

        // confirmar los passwords
        const validPassword = bcrypt.compareSync(password, usuario.password)
        if (!validPassword) {
            return res.status(400).json({
                ok: false,
                msg: 'Password No valida'
            })
        }

        //Generar nuestros jwt

        const token = await generarJWT(usuario.id, usuario.name)

        return res.status(201).json({
            ok: true,
            uid: usuario.id,
            name: usuario.name,
            token
        })


    } catch (error) {
        errorMessage();
    }
    res.json({
        ok: true,
        msg: 'login',
        email,
        password
    })

}

const renewToken = async (req, res = response) => {
    const uid = req.uid;
    const name = req.name;

    // generar un nuevo jwt y retornarlo en la peticion
    const token = await generarJWT(uid, name)

    res.json({
        ok: true,
        token
    })

}


module.exports = { crearUsuario, login, renewToken }