'use strict'

var League = require('../models/league.model');
var Team = require('../models/team.model');
var User = require('../models/user.model')

function setTeam(req, res){
    var leagueId = req.params.id;
    var userId = req.params.idU;
    var params = req.body;
    var team = new Team();

    League.findById(leagueId, (err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general 1'});
        }else if(leagueFind){
            team.name = params.name;
            team.image = params.image;
            team.count = params.count;
            team.save((err, teamSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general 2'});
                }else if(teamSaved){
                    console.log(leagueFind)
                    League.findByIdAndUpdate(leagueId, {$push:{teams: teamSaved._id}}, {new: true}, (err, pushTeam)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al hacer push'});
                        }else if(pushTeam){
                            User.findById(userId, (err, userFind)=>{
                                if(err){
                                    console.log('error')
                                }else if(userFind){
                                    return res.send({message: 'Se pusheo correctamente el equipo', pushTeam, userFind});
                                }
                            }).populate([
                                {
                                  path: "leagues",
                                  model: "league",
                                  populate:{
                                    path: 'teams',
                                    model: 'team'
                                  }
                                },
                              ])
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

    if(params.name || params.image){
        League.findOne({_id: leagueId, teams: teamId}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general 2'});
            }else if(leagueFind){
                Team.findByIdAndUpdate(teamId, params, {new: true}, (err, updateTeam)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general 3'});
                    }else if(updateTeam){
                        return res.send({message: 'Equipo actualizao', updateTeam});
                    }else{
                        return res.status(404).send({message: 'No se pudo actualizar el equipo'});
                    }
                })
            }else{
                return res.status(404).send({message: 'No existe esta liga'});
            }
        })
    }else{
        return res.status(404).send({message: 'Ingresa los datos mínimos'});    
    }
}

function removeTeam(req,res){
    let leagueId = req.params.idL;
    let teamId = req.params.idT;

    League.findByIdAndUpdate({_id: leagueId, teams: teamId}, {$pull: {teams: teamId}}, {new:true}, (err, teamPull)=>{
        if(err){
            return res.status(500).send({message: 'Error general 1'})
        }else if(teamPull){
            Team.findByIdAndRemove(teamId, (err, teamRemove)=>{
                if(err){
                    return res.status(500).send({message: 'Error general 2', err})
                }else if(teamRemove){
                    return res.send({message: 'Se elimino el equipo: ', teamRemove});
                }else{
                    return res.status(404).send({message: 'No se pudo eliminar'})
                }
            })
        }else{
            return res.status(404).send({message: 'No se pusheo, no exist team'})
        }
    }).populate('teams')
}

function getTeams(req, res){
    Team.find({}).populate('leagues').exec((err, teams)=>{
        if(err){
            return res.status(500).send({message: 'Error general 1', err})
        }else if(teams){
            return res.send({message: 'Equipos encontrados', teams})
        }else{
            return res.status(404).send({message: 'No hay registros'})
        }
    })
}

module.exports = {
    setTeam,
    updateTeam,
    removeTeam,
    getTeams
}