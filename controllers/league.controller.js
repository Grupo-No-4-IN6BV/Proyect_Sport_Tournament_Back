'user strict'

var User = require('../models/user.model');
var League = require('../models/league.model');

function createDefault(req, res){
    let league = new League();
    
    league.name = 'default';

    League.findOne({name: league.name}, (err, leagueFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'})
        }else if(leagueFind){
            return console.log('Liga default ya se creo');
        }else {
            league.save((err, leagueSaved)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(leagueSaved){
                    return console.log('Liga default creada exitosamente');
                }else{
                    return res.status(500).send({message: 'Liga no creada'})
                }
            })
        }
    })
}

function saveLeague(req, res){

    var league = new League();
    var params = req.body;

    if(params.name || params.description){
        League.findOne({name: params.name}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(leagueFind){
                res.send({message: 'Liga ya existente'});
            }else{
                league.name = params.name;

                league.save((err, leagueSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general'})
                    }else if(leagueSaved){
                        return res.send({message: 'Liga creada exitosamente', leagueSaved})
                    }else {
                        return res.status(403).send({message: 'No se creo liga'}) 
                    }
                })

            }
        })
    }else {
        return res.status(404).send({message: 'Por favor llenar los campos requeridos'});
    }
}

function updateLeague(req, res){
    let leagueId = req.params.id;
    let update = req.body;

    if(update.name){
        League.findOne({name: update.name}, (err, leagueFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general'});
            }else if(leagueFind){
                return res.send({message: 'Esta liga ya existe'});
            }else{
                League.findByIdAndUpdate(leagueId, update, {new:true}, (err, leagueUpdate)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'})
                    }else if(leagueUpdate){
                        return res.send({message: 'Liga actualizada', leagueUpdate})
                    }else{
                        return res.status(401).send({message: 'No se actualizó la liga'})  
                    }
                })
            }
        })
    }else {
        return res.status(404).send({message: 'Llena un campo para poder actualizar'})
    }   
}


function removeLeague(req, res){
    let leagueId = req.params.id;

    League.findOne({name : 'default'}, (err, leagueDefault)=>{
        if(err){
            return res.status(500).send({message: 'Error en el servidor'});
        }else if(leagueDefault){
            User.updateMany({leagues: leagueId},{$set: {leagues: leagueDefault.id}}, (err, usersFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error en el servidor'});
                }else if(usersFind){
                    League.findByIdAndDelete(leagueId, (err, leagueDeleted)=>{
                        if(err){
                            return res.status(500).send({message: 'Error en el servidor'});
                        }else if(leagueDeleted){
                            return res.send({message: 'Liga eliminada satisfactoriamente', leagueDeleted})
                        }else{
                            return res.status(404).send({message: 'No existe la liga'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No se encuentran equipos con dicha liga'});
                }
            }).populate('league')
        }else{
            return res.status(404).send({message: 'No hay registro de la liga por default'});
        }
    })
}

function searchLeague(req, res){
    var params = req.body;

        if(params.search){
            League.find({$or:[{name: params.search}]}, (err, resultsSearch)=>{
                if(err){
                    return res.status(500).send({message: 'Error General'});
                }else if(resultsSearch){
                    return res.send({resultsSearch})
                }else{
                    return res.status(404).send({message: 'No hay registros de liga por mostrar'});
                }
        })
    }else{
        return res.status(403).send({message: 'Ingresar nombre para buscar la liga'})
    }
}

module.exports = {
    createDefault,
    saveLeague,
    updateLeague,
    removeLeague,
    searchLeague
}