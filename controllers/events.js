const { response } = require('express');
const Evento = require('../models/Evento');
const getEventos = async (req, res = response) => {
    const eventos = await Evento.find().populate('user', 'name');

    res.json({
        ok: true,
        eventos
    })

}
const createEventos = async (req, res = response) => {
    const evento = new Evento(req.body);
    try {
        evento.user = req.uid;
        const eventoGuardado = await evento.save()
        return res.json({
            ok: true,
            evento: eventoGuardado
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "hable con el admin"
        })
    }

}
const updateEventos = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid
    try {
        const evento = await Evento.findById(eventoId);


        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'evento no existe'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede editar elemento'
            })
        }

        const nuevoEvento = {
            ...req.body,
            user: uid
        }

        const eventoActualizado = await Evento.findByIdAndUpdate(eventoId, nuevoEvento, { new: true })
        res.json({
            ok: true,
            msg: eventoActualizado
        })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "hable con el admin"
        })

    }

}

const deleteEventos = async (req, res = response) => {
    const eventoId = req.params.id;
    const uid = req.uid
    try {
        const evento = await Evento.findById(eventoId);


        if (!evento) {
            return res.status(404).json({
                ok: false,
                msg: 'evento no existe'
            })
        }

        if (evento.user.toString() !== uid) {
            return res.status(401).json({
                ok: false,
                msg: 'No puede eliminar elemento'
            })
        }

        await Evento.findByIdAndDelete(eventoId)
        res.json({ ok: true })


    } catch (error) {
        console.log(error)
        return res.status(500).json({
            ok: false,
            msg: "hable con el admin"
        })

    }

}
module.exports = {
    getEventos,
    createEventos,
    updateEventos,
    deleteEventos
}

// {
//     ok:true,
//     msg:'Obtener eventos'
// }

// {
//     ok:true,
//     msg:'Crear eventos'
// }

// {
//     ok:true,
//     msg:'Actualizar eventos'
// }