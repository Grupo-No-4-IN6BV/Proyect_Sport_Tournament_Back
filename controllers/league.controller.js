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

function setLeague(req, res){
    var userId = req.params.id;
    var params = req.body;
    var league = new League();

    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        User.findById(userId, (err, userFind)=>{
            if(err){
                return res.status(500).send({message: 'Error general en la busqueda'});
            }else if(userFind){
                league.name = params.name;
                league.image = params.image;
                league.count = '0';
                league.save((err, leagueSaved)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al guardar'});
                    }else if(leagueSaved){
                        User.findByIdAndUpdate(userId, {$push:{leagues: leagueSaved._id}}, {new: true}, (err, pushLeague)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al setear contacto'});
                            }else if(pushLeague){
                                console.log(pushLeague)
                                return res.send({message: 'Contacto creado y agregado', pushLeague});
                            }else{
                                return res.status(404).send({message: 'No se seteo el contacto, pero sí se creó en la BD'});
                            }
                        }).populate('leagues')
                    }else{
                        return res.status(404).send({message: 'No se pudo guardar el contacto'});
                    }
                })

            }else{
                return res.status(404).send({message: 'Usuario no existente para crear contactos'});
            }
        })
    }
}

function removeLeague(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    if(userId != req.user.sub){
        return res.status(500).send({message: 'No tienes permiso para realizar esta acción'})
    }else{
        User.findOneAndUpdate({_id: userId, leagues: leagueId},
            {$pull: {leagues: leagueId}}, {new:true}, (err, leaguePull)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'})
                }else if(leaguePull){
                    League.findByIdAndRemove(leagueId, (err, leagueRemoved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al eliminar el contacto, pero sí eliminado del registro de usuario', err})
                        }else if(leagueRemoved){
                            return res.send({message: 'Contacto eliminado permanentemente', leaguePull});
                        }else{
                            return res.status(404).send({message: 'Registro no encontrado o contacto ya eliminado'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe el usuario que contiene el contacto a eliminar'})
                }
            }).populate('leagues')
    }
}

function updateLeague(req, res){
    let userId = req.params.idU;
    let leagueId = req.params.idL;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(404).send({message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.name){
            User.findOne({_id: userId, leagues: leagueId}, (err, userLeague)=>{
                if(err){
                    return res.status(500).send({message: 'Error general'});
                }else if(userLeague){
                    League.findByIdAndUpdate(leagueId, update, {new: true}, (err, updateLeague)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al actualizar'});
                        }else if(updateLeague){
                            User.findOne({_id: userId, leagues: leagueId}, (err, userLeagueAct)=>{
                                if(err){

                                }else if(userLeagueAct){
                                    return res.send({message: 'Contacto actualizado', userLeagueAct});
                                }
                            }).populate('leagues')
                            
                        }else{
                            return res.status(401).send({message: 'No se pudo actualizar el contacto'});
                        }
                    })
                }else{
                    return res.status(404).send({message: 'Usuario o contacto inexistente'});
                }
            }).populate('leagues')
        }else{
            return res.status(404).send({message: 'Por favor ingresa los datos mínimos'});
        }       
    }
}


module.exports = {
    createDefault,
    saveLeague,
    updateLeague,
    removeLeague,
    searchLeague,
    setLeague
}