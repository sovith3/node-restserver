const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);


const Usuario = require('../models/usuario');
const app = express();


app.post('/login',(req, res)=>{
    let body = req.body;
    Usuario.findOne({email:body.email},(err,usuarioBD)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuarioBD){
            return res.status(500).json({
                ok: false,
                err:{
                    message: 'Usuario no encontrado'
                }
            })
        }
        if(!bcrypt.compareSync(body.password,usuarioBD.password)){
            return res.json({
                ok: false,
                err:{
                    message:'Contrasena incorrecta'
                }
            })
        }
        let token = jwt.sign({
            usuario: usuarioBD
        },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

        res.json({
            ok:true,
            usuario:usuarioBD,
            token
        })
    })
})


//CONFIGURACIONES DE GOOGLE
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID,
        // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });

    const payload = ticket.getPayload();
 
    return {
        nombre:payload.name,
        email:payload.email,
        imagen:payload.imagen,
        google:true
    }
  }


//
app.post('/google', async (req,res)=>{

    let token = req.body.idtoken;
    let googleUser = await verify(token)
                    .catch( e => {
                        return res.status(401).json({
                            ok:false,
                            e
                        })
                    })

    Usuario.findOne({email:googleUser.email},(err,usuarioBD)=>{
        if(err){
            return res.status(500).json({
                ok: false,
                err
            });    
        }

        if(usuarioBD){
            if(usuarioBD.google===false){
                
                res.status(500).json({
                    ok:false,
                    err:{
                        message:'Debe iniciar sesion con su cuenta normal'
                    }     
                })
                
            }else{
                
                let token = jwt.sign({
                    usuario: usuarioBD
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});

                res.status(200).json({
                    ok:true,
                    usuarioBD,
                    token
                })
            }
        }else{
            usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.imagen;
            usuario.google = googleUser.google;
            usuario.password = ':)'

            usuario.save((err,usuarioBD)=>{

                if(err){
                    return res.status(400).json({
                        ok:false,
                        usuarioBD,
                        err
                    })    
                }

                let token = jwt.sign({
                    usuario: usuarioBD
                },process.env.SEED,{expiresIn: process.env.CADUCIDAD_TOKEN});
    
                res.status(200).json({
                    ok:true,
                    usuarioBD,
                    token
                })
            });

            
        }
        

    });

    


})
module.exports = app;