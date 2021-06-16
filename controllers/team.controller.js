'use strict'

var League = require('../models/league.model');
var Team = require('../models/team.model');

function setTeam(req, res){
    var leagueId = req.params.id;
    var params = req.body;
    var team = new Team();

    League.findById(leagueId, (err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general 1'});
        }else if(leagueFind){
            team.name = params.name;
            team.image = params.image;

            team.save((err, teamSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general 2'});
                }else if(teamSaved){
                    League.findByIdAndUpdate(leagueId, {$push:{teams: teamSaved._id}}, {new: true}, (err, pushTeam)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al hacer push'});
                        }else if(pushTeam){
                            return res.send({message: 'Se pusheo correctamente el equipo', pushTeam});
                        }else{
                            return res.status(404).send({message: 'No se encontro'});
                        }
                    }).populate('teams')
                }else{
                    return res.status(404).send({message: 'No se pudo guardar'});
                }
            })
        }else {
            return res.status(404).send({message: 'No existe esta liga'});
        }
    })
}

function updateTeam(req, res){
    let leagueId = req.params.idL;
    let teamId = req.params.idT;   
    let params = req.body;
    le

    if(params.name || params.image){
        League.findOne({_id: leagueId, teams: teamId}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general 2'});
            }else if(leagueFind){
                Team.
            }else{
                return res.status(404).send({message: 'No se encontro la liga'});
            }
        })
    }else{
        return res.status(404).send({message: 'Ingresa los datos mínimos'});    
    }
}

module.exports = {
    setTeam
}