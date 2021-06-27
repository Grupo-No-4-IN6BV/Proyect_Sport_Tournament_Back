'use strict'

var League = require('../models/league.model');
var Team = require('../models/team.model');
var User = require('../models/user.model')
var Match = require('../models/mach.model');
const machModel = require('../models/mach.model');

function teamdefault(req, res){
    let team = new Team();
    team.name = 'default'

    Team.findOne({name: team.name}, (err, teamfind)=>{
        if(err){
            return res.status(500).send({message: 'Error general 1'});
        }else if(teamfind){
            return console.log('team default ya se creo');
        }else{
            team.save((err, teamdefaultSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general 1'});
                }else if(teamdefaultSaved){
                    return console.log('team default creado satisfactoriamente');
                }else{
                    return res.status(204).send({message: 'no se creo el team default'});
                }
            })
        }
    })
}

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
            team.league = leagueId; 
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
    let userId = req.params.idU;
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
                        Match.updateMany({idTeam: teamId}, params, (err, updateMatch)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general 3'});
                            }else if(updateMatch){
                                return res.send({message: 'se actualizo', updateMatch});
                            }else{
                                return res.send({message: 'no se pudo actualizar'});
                            }
                        })
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




function updateMach(req, res){
    let teamId = req.params.idT; 
    let leagueId = req.params.idL;   
    let params = req.body;
    var match = new Match();
    var matchL = new Match();


    if(params.goals == params.goalsf){
        Team.findById(teamId, (err, teamFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general1'});
            }else if(teamFind){
               Match.findOne({idMatch: params.idMatch, idTeam: teamId}, (err, matchfind)=>{
                   if(err){
                    return res.status(500).send({message: 'Error general2'});
                   }else if(matchfind){
                        match._id = matchfind._id;
                        match.goals =  matchfind.goals + params.goals;
                        match.goalsf = matchfind.goalsf + params.goalsf;
                        match.matchCount = matchfind.matchCount + params.matchCount;
                        match.idMatch = params.idMatch
                        match.value = matchfind.value + 1;
                        Match.findByIdAndUpdate(matchfind._id, match, {new: true}, (err, updateTeam)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general 5'});
                            }else if(updateTeam){
                                Team.findById(params.idLoser, (err, teamLoserFind)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general 5'});
                                    }else if(teamLoserFind){
                                        Match.findOne({idMatch: params.idMatch, idTeam: teamLoserFind._id}, (err, matchLoserfind)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general 5'});
                                            }else if(matchLoserfind){
                                                matchL._id = matchLoserfind._id;
                                                matchL.goals = matchLoserfind.goals + params.goalsf;
                                                matchL.goalsf = matchLoserfind.goalsf + params.goals;
                                                matchL.matchCount = matchLoserfind.matchCount + params.matchCount;
                                                matchL.value = matchLoserfind.value + 1;
                                                matchL.idMatch = params.idMatch;
                                                console.log(matchL)
                                                Match.findByIdAndUpdate(matchLoserfind._id, matchL, {new: true}, (err, updateTeamL)=>{
                                                    if(err){
    
                                                    }else if(updateTeamL){
                                                        return res.send({message: 'se agrego exitosamente el partido',updateTeamL});
                                                    }else{
    
                                                    }
                                                })
                                            }else{
                                                matchL.goals = params.goalsf;
                                                matchL.goalsf = params.goals;
                                                matchL.matchCount = params.matchCount;
                                                matchL.idTeam = teamLoserFind._id;
                                                matchL.name = teamLoserFind.name;
                                                matchL.idLeague = leagueId;
                                                matchL.idMatch = params.idMatch;
                                                matchL.value = 1;
                                                matchL.save((err, matchLSaved)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general 3'});
                                                    }else if(matchLSaved){
                                                        Team.findByIdAndUpdate(params.idLoser, {$push:{leagueMatch: matchLSaved._id}}, {new: true}, (err, pushLMatch)=>{
                                                            if(err){
                                                                return res.status(500).send({message: 'Error general 3'});
                                                            }else if(pushLMatch){
                                                                return res.send({message: 'se agrego exitosamente el partido',pushLMatch});
                                                            }else{
    
                                                            }
                                                        })
                                                    }else{
    
                                                    }
                                                })
                                            }
                                        })
                                    }else{}
                                })
                            }else{
                                return res.status(404).send({message: 'No se pudo actualizar el equipo'});
                            }
                            })
                    }else{
                        match.goals = params.goals;
                        match.goalsf = params.goalsf;
                        match.matchCount = params.matchCount;
                        match.idTeam = teamId;
                        match.name = teamFind.name;
                        match.idMatch = params.idMatch;
                        match.idLeague = leagueId;
                        match.value = 1;
                        match.save((err, matchSaved)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general 3'});
                            }else if(matchSaved){
                                Team.findByIdAndUpdate(teamId, {$push:{leagueMatch: matchSaved._id}}, {new: true}, (err, pushMatch)=>{
                                    if(err){
                                        return res.status(500).send({message: 'Error general 3'});
                                    }else if(pushMatch){
                                        console.log(params.idLoser)
                                        Team.findById(params.idLoser, (err, teamLoserFind)=>{
                                            if(err){
                                                return res.status(500).send({message: 'Error general 5'});
                                            }else if(teamLoserFind){
                                                Match.findOne({idMatch: params.idMatch, idTeam: teamLoserFind._id}, (err, matchLoserfind)=>{
                                                    if(err){
                                                        return res.status(500).send({message: 'Error general 5'});
                                                    }else if(matchLoserfind){
                                                        matchL._id = matchLoserfind._id;
                                                        matchL.goals = matchLoserfind + params.goalsf;
                                                        matchL.goalsf = matchLoserfind + params.goals
                                                        matchL.matchCount = matchLoserfind.matchCount + params.matchCount;
                                                        matchL.value = matchLoserfind.value+1;
                                                        matchL.idMatch = params.idMatch;
                                                        Match.findByIdAndUpdate(matchLoserfind._id, matchL, {new: true}, (err, updateTeamL)=>{
                                                            if(err){
            
                                                            }else if(updateTeamL){
                                                                return res.send({message: 'se agrego exitosamente el partido',updateTeamL});
                                                            }else{
            
                                                            }
                                                        })
                                                    }else{
                                                        matchL.goals = params.goalsf;
                                                        matchL.goalsf = params.goals;
                                                        matchL.matchCount = params.matchCount;
                                                        matchL.idTeam = params.idLoser
                                                        matchL.name = teamLoserFind.name;
                                                        matchL.idLeague = leagueId;
                                                        matchL.idMatch = params.idMatch;
                                                        matchL.value = 1;
                                                        matchL.save((err, matchLSaved)=>{
                                                            if(err){
                                                                return res.status(500).send({message: 'Error general 3'});
                                                            }else if(matchLSaved){
                                                                Team.findByIdAndUpdate(params.idLoser, {$push:{leagueMatch: matchLSaved._id}}, {new: true}, (err, pushLMatch)=>{
                                                                    if(err){
                                                                        return res.status(500).send({message: 'Error general 3'});
                                                                    }else if(pushLMatch){
                                                                        return res.send({message: 'se agrego exitosamente el partido',pushLMatch});
                                                                    }else{
            
                                                                    }
                                                                })
                                                            }else{
            
                                                            }
                                                        })
                                                    }
                                                })
                                            }else{}
                                        })
                                    }else{
    
                                    }
                                })
                            }else{
    
                            }
                        })
                    }
               })
            }else{
                return res.status(404).send({message: 'No existe este equipo'});
            }
        })


    }else{

    Team.findById(teamId, (err, teamFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general1'});
        }else if(teamFind){
           Match.findOne({idMatch: params.idMatch, idTeam: teamId}, (err, matchfind)=>{
               if(err){
                return res.status(500).send({message: 'Error general2'});
               }else if(matchfind){
                    match._id = matchfind._id;
                    match.goals =  matchfind.goals + params.goals;
                    match.goalsf = matchfind.goalsf + params.goalsf;
                    match.matchCount = matchfind.matchCount + params.matchCount;
                    match.idMatch = params.idMatch
                    match.value = matchfind.value + 3;
                    Match.findByIdAndUpdate(matchfind._id, match, {new: true}, (err, updateTeam)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general 5'});
                        }else if(updateTeam){
                            Team.findById(params.idLoser, (err, teamLoserFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general 5'});
                                }else if(teamLoserFind){
                                    Match.findOne({idMatch: params.idMatch, idTeam: teamLoserFind._id}, (err, matchLoserfind)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general 5'});
                                        }else if(matchLoserfind){
                                            matchL._id = matchLoserfind._id;
                                            matchL.goals = matchLoserfind.goals + params.goalsf;
                                            matchL.goalsf = matchLoserfind.goalsf + params.goals;
                                            matchL.matchCount = matchLoserfind.matchCount + params.matchCount;
                                            matchL.value = matchLoserfind.value;
                                            matchL.idMatch = params.idMatch;
                                            console.log(matchL)
                                            Match.findByIdAndUpdate(matchLoserfind._id, matchL, {new: true}, (err, updateTeamL)=>{
                                                if(err){

                                                }else if(updateTeamL){
                                                    return res.send({message: 'se agrego exitosamente el partido',updateTeamL});
                                                }else{

                                                }
                                            })
                                        }else{
                                            matchL.goals = params.goalsf;
                                            matchL.goalsf = params.goals;
                                            matchL.matchCount = params.matchCount;
                                            matchL.idTeam = teamLoserFind._id;
                                            matchL.name = teamLoserFind.name;
                                            matchL.idLeague = leagueId;
                                            matchL.idMatch = params.idMatch;
                                            matchL.value = 0;
                                            matchL.save((err, matchLSaved)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general 3'});
                                                }else if(matchLSaved){
                                                    Team.findByIdAndUpdate(params.idLoser, {$push:{leagueMatch: matchLSaved._id}}, {new: true}, (err, pushLMatch)=>{
                                                        if(err){
                                                            return res.status(500).send({message: 'Error general 3'});
                                                        }else if(pushLMatch){
                                                            return res.send({message: 'se agrego exitosamente el partido',pushLMatch});
                                                        }else{

                                                        }
                                                    })
                                                }else{

                                                }
                                            })
                                        }
                                    })
                                }else{}
                            })
                        }else{
                            return res.status(404).send({message: 'No se pudo actualizar el equipo'});
                        }
                        })
                }else{
                    match.goals = params.goals;
                    match.goalsf = params.goalsf;
                    match.matchCount = params.matchCount;
                    match.idTeam = teamId;
                    match.name = teamFind.name;
                    match.idLeague = leagueId;
                    match.idMatch = params.idMatch;
                    match.value = 3;
                    match.save((err, matchSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general 3'});
                        }else if(matchSaved){
                            Team.findByIdAndUpdate(teamId, {$push:{leagueMatch: matchSaved._id}}, {new: true}, (err, pushMatch)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general 3'});
                                }else if(pushMatch){
                                    console.log(params.idLoser)
                                    Team.findById(params.idLoser, (err, teamLoserFind)=>{
                                        if(err){
                                            return res.status(500).send({message: 'Error general 5'});
                                        }else if(teamLoserFind){
                                            Match.findOne({idMatch: params.idMatch, idTeam: teamLoserFind._id}, (err, matchLoserfind)=>{
                                                if(err){
                                                    return res.status(500).send({message: 'Error general 5'});
                                                }else if(matchLoserfind){
                                                    matchL._id = matchLoserfind._id;
                                                    matchL.goals = matchLoserfind + params.goalsf;
                                                    matchL.goalsf = matchLoserfind + params.goals
                                                    matchL.matchCount = matchLoserfind.matchCount + params.matchCount;
                                                    matchL.value = matchLoserfind.value;
                                                    matchL.idMatch = params.idMatch;
                                                    Match.findByIdAndUpdate(matchLoserfind._id, matchL, {new: true}, (err, updateTeamL)=>{
                                                        if(err){
        
                                                        }else if(updateTeamL){
                                                            return res.send({message: 'se agrego exitosamente el partido',updateTeamL});
                                                        }else{
        
                                                        }
                                                    })
                                                }else{
                                                    matchL.goals = params.goalsf;
                                                    matchL.goalsf = params.goals;
                                                    matchL.matchCount = params.matchCount;
                                                    matchL.idTeam = params.idLoser
                                                    matchL.name = teamLoserFind.name;
                                                    matchL.idLeague = leagueId;
                                                    matchL.idMatch = params.idMatch;
                                                    matchL.value = 0;
                                                    matchL.save((err, matchLSaved)=>{
                                                        if(err){
                                                            return res.status(500).send({message: 'Error general 3'});
                                                        }else if(matchLSaved){
                                                            Team.findByIdAndUpdate(params.idLoser, {$push:{leagueMatch: matchLSaved._id}}, {new: true}, (err, pushLMatch)=>{
                                                                if(err){
                                                                    return res.status(500).send({message: 'Error general 3'});
                                                                }else if(pushLMatch){
                                                                    return res.send({message: 'se agrego exitosamente el partido',pushLMatch});
                                                                }else{
        
                                                                }
                                                            })
                                                        }else{
        
                                                        }
                                                    })
                                                }
                                            })
                                        }else{}
                                    })
                                }else{

                                }
                            })
                        }else{

                        }
                    })
                }
           })
        }else{
            return res.status(404).send({message: 'No existe este equipo'});
        }
    })
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
                    Match.deleteMany({idTeam: teamId}, (err, matchdelete)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general 1'})
                        }else if(matchdelete){
                            return res.send({message: 'Se elimino el equipo: ', matchdelete});
                        }else{
                            return res.send({message: 'Error general 2'})
                        }
                    })
                    
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



function getMatches(req, res){
    let leagueId = req.params.idL; 
    var params = req.body;

    Match.find({idLeague:leagueId, idMatch: params.idMatch }).exec((err, matches) => {
        if(err){
            return res.status(500).send({message: "Error al buscar los usuarios"})
        }else if(matches){
            console.log(matches)
            Team.find({league: leagueId}).countDocuments((err, countTeams)=>{
                if(err){
                    return res.status(500).send({message: "Error al buscar los usuarios"})
                }else if(countTeams){
                    console.log(countTeams)
                    return res.send({message: "Usuarios encontrados", matches, countTeams})
                }else{
                    return res.status(204).send({message: "No se encontraron usuarios"})
                }
            })
            
        }else{
            return res.status(204).send({message: "No se encontraron usuarios"})
        }
    })
}

module.exports = {
    teamdefault,
    setTeam,
    updateTeam,
    removeTeam,
    getTeams,
    updateMach,
    getMatches
    
}