'use strict'

var Torneo = require('../models/torneo.model');
const userModel = require('../models/user.model');
var User = require('../models/user.model');

function createTorneo(req, res){
   let torneo = new Torneo();
   let params = req.body;
    if(params.name && params.rules && params.players){
            torneo.name = params.name;
            torneo.description = params.description;
            torneo.rules = params.rules;
            torneo.prize = params.prize;
            torneo.players = params.player;
            torneo.save((err, torneoSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al guardar el torneo'});
                }else if(torneoSaved){
                return res.send({message: 'Torneo creado exitosamente', torneoSaved});
                }else{
                    return res.status(500).send({message: 'No se pudo crear el torneo'});
                }
            })
        }else{
            return res.status(401).send({message: 'Por favor envía los datos mínimos para la creación del torneo'})
        }
}

function removeTorneo(req, res){
    let torneoId = req.params.id;

    Torneo.findByIdAndRemove(torneoId, (err, torneoRemoved)=>{
        if(err){
            return res.status(500).send({message: "Error con eliminar el torneo"})
        }else if(torneoRemoved){
            return res.send({message: "Torneo eliminado: ", torneoRemoved})
        }else{
            return res.status(404).send({message: "No se pudo eliminar el torneo"})
        }
    })
}

function updateTorneo(req, res){
    let torneoId = req.params.id;
    let update = req.body;

    Torneo.findByIdAndUpdate(torneoId, update, {new:true}, (err, torneoUpd)=>{
        if(err){
            return res.status(500).send({message: "Error al intentar actualizar"})
        }else if(torneoUpd){
            return res.send({message: "Torneo actualizado exitosamente", torneoUpd})
        }else{
            return res.status(404).send({message: "No se pudo actualizar el torneo"})
        }
    })
}

function getTorneos(req, res){
    Torneo.find({}).exec((err, torneos)=>{
        if(err){
            res.status(500).send({message: 'Error en el servidor', err});
        }else if(torneos){
            res.status(200).send({message: 'Existen estos torneos: ', torneos});
        }else{
            res.status(200).send({message: 'No hay registros'});
        }
    })
}

function getTorneo(req, res){
    let torneoId = req.params.id;
    Torneo.findById(torneoId).exec((err, torneoFound)=>{
        if(err){
            return res.status(500).send({message: "Error general"})
        }else if(torneoFound){
            return res.send({message: "Hemos encontrado este torneo", torneoFound})
        }else{
            return res.status(404).send({message: "No se encontro ese torneo"})
        }
    })
}

module.exports = {
    createTorneo,
    removeTorneo,
    updateTorneo,
    getTorneo,
    getTorneos
}