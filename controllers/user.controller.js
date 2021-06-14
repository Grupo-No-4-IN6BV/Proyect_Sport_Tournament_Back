'user strict'

var User = require('../models/user.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');

var fs = require('fs');
var path = require('path');


function initAdmin(req, res){
    let user = new User();
    user.username = 'ADMIN'
    user.password = 'deportes123'

    User.findOne({username: user.username}, (err, adminFind)=>{
        if(err){
            return res.status(500).send({message: 'Error general'});
        }else if(adminFind){
            return console.log('Usuario admin ya existente')
        }else{
            bcrypt.hash(user.password, null, null, (err, passwordHash)=>{
                if(err){
                    return res.status(500).send({message: 'Error al intentar comparar las contraseñas'})
                }else if(passwordHash){
                    user.password = passwordHash;
                    user.username = user.username;
                    user.role = 'ROLE_ADMIN';
                    user.save((err, userSaved)=>{
                        if(err){
                            return res.status(500).send({message: 'Error al guardar Administrador'})
                        }else if(userSaved){
                            return console.log('Administrador creado satisfactoriamente')
                        }else{
                            return res.status(500).send({message: 'Administrador no guardado'})
                        }
                    })
                }else{
                    return res.status(403).send({message: 'La encriptación de la contraseña falló'})
                }
            })
        }
    })
}

function login(req, res){
    var params = req.body;

    if(params.username && params.password){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(500).send({message: "Error al buscar el usuario"})
            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword) => {
                    if(err){
                        return res.status(500).send({message: "Error al comparar la contraseña"})
                    }else if(checkPassword){
                        if(params.gettoken){
                            res.send({
                                token: jwt.createToken(userFind),
				                user: userFind
                            })
                        }else{
                            return res.send({ message: "Usuario logeado", userFind})
                        }
                    }else{
                        return res.status(401).send({message: "Contraseña incorrecta"})
                    }
                })
            }else{
                return res.send({message: "Usuario no existente"})
            }
        })
    }else{
        return res.status(404).send({message: "Ingrese Username y contraseña"})
    }
}

function register(req, res){
    var user = new User();
    var params = req.body;

    if(params.name && params.username && params.password && params.email){
        User.findOne({username: params.username}, (err, userFind) => {
            if(err){
                return res.status(404).send({message: 'Ocurrio un error al buscar el usuario'})
            }else if(userFind){
                return res.send({message: "Nombre no disponible, intenta con otro"})
            }else{
                bcrypt.hash(params.password, null, null, (err, passwordHash) => {
                    if(err){
                        return res.status(404).send({message: "La encriptación de la contraseña falló", err})
                    }else if(passwordHash){
                        user.password = passwordHash;
                        user.name = params.name;
                        user.username = params.username;
                        user.email = params.email;
                        user.role = 'ROLE_USER';
                        user.save((err, userSaved) => {
                            if(err){
                                return res.status(404).send({message: "ocurrio un error al intentar guardar el usuario"})
                            }else if(userSaved){
                                return res.send({message: "Usuario creado satisfactoriamente",userSaved})
                            }else{
                                return res.status(403).send({message: "Error al intentar guardar Datos"})
                            }
                        })
                    }else{
                        return res.status(401).send({message: "la contraseña no encriptada"})
                    }
                })
            }
        })
    }else{
        return res.status(404).send({message: "Ingrese los datos minimos: Username, name, password, email."})
    }
}

function getUsers(req, res){
    User.find({}).exec((err, userFinds) => {
        if(err){
            return res.status(500).send({message: "Error al buscar los usuarios"})
        }else if(userFinds){
            return res.send({message: "Usuarios encontrados", userFinds})
        }else{
            return res.status(204).send({message: "No se encontraron usuarios"})
        }
    })
}

function updateUser(req, res){
    let userId = req.params.id;
    let update = req.body;

    if(userId != req.user.sub){
        return res.status(401).send({ message: 'No tienes permiso para realizar esta acción'});
    }else{
        if(update.password || update.role){
            return res.status(401).send({ message: 'No se puede actualizar la contraseña ni el rol desde esta función'});
        }else{
            if(update.username){
                User.findOne({username: update.username.toLowerCase()}, (err, userFind)=>{
                    if(err){
                        return res.status(500).send({ message: 'Error general en la busqueda de usuario'});
                    }else if(userFind){
                        if(userFind._id == req.user.sub){
                            User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al actualizar'});
                                }else if(userUpdated){
                                    return res.send({message: 'Usuario actualizado', userUpdated});
                                }else{
                                    return res.send({message: 'No se pudo actualizar al usuario'});
                                }
                            })
                        }else{
                            return res.send({message: 'Nombre de usuario ya en uso'});
                        }
                    }else{
                        User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                            if(err){
                                return res.status(500).send({message: 'Error general al actualizar'});
                            }else if(userUpdated){
                                return res.send({message: 'Usuario actualizado', userUpdated});
                            }else{
                                return res.send({message: 'No se pudo actualizar al usuario'});
                            }
                        })
                    }
                })
            }else{
                User.findByIdAndUpdate(userId, update, {new: true}, (err, userUpdated)=>{
                    if(err){
                        return res.status(500).send({message: 'Error general al actualizar'});
                    }else if(userUpdated){
                        return res.send({message: 'Usuario actualizado', userUpdated});
                    }else{
                        return res.send({message: 'No se pudo actualizar al usuario'});
                    }
                })
            }
        }
    }
    
}

function saveUser(req, res){
function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != res.user.sub){
        return res.status(500).send({message: 'No tiene permis de realizar la accion'})
    }else{
        if(!params.password){
            return res. status(401).send({message: 'Porfavor ingresa la contrase;a para poder elimnar la cuenta'})
        }

        User.findById(userId, (err,userFind )=>{
            if(err){

            }else if(userFind){
                bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{

                })

            }else{
                
            }
        })
    }
}

function removeUser(req, res){
    let userId = req.params.id;
    let params = req.body;

    if(userId != req.user.sub){
        return res.status(403).send({message: ' No tienes permiso para realizar esta acción'})
    }else{
        if(!params.password){
            return res.status(401).send({message: 'Ingresar contraseña para poder eliminar tu cuenta'});
        }else{
            User.findById(userId, (err, userFind)=>{
                if(err){
                    return res.status(500).send({message: 'Error general al buscar usuario'})
                }else if(userFind){
                    bcrypt.compare(params.password, userFind.password, (err, checkPassword)=>{
                        if(err){
                            return res.status(500).send({message: 'Error general al verificar contraseña'})
                        }else if(checkPassword){
                            User.findByIdAndRemove(userId, (err, userFind)=>{
                                if(err){
                                    return res.status(500).send({message: 'Error general al verificar contraseña'})
                                }else if(userFind){
                                    return res.send({message: 'Usuario eliminado', userRemoved:userFind})
                                }else{
                                    return res.status(404).send({message: 'Usuario no encontrado o ya eliminado'})
                                }
                            })
                        }else{
                            return res.status(403).send({message: 'Contraseña incorrecta, solo con tu contraseña podrás eliminar tu cuenta'})
                        }
                    })
                }else{
                    return res.status(404).send({message: 'No existe la cuenta, o ya eliminado'})
                }
            })
        }
    }
}

module.exports = {
    initAdmin,
    register,
    login,
    getUsers,
    updateUser,
    removeUser

}