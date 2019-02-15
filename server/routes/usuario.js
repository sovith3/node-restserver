const express = require('express');
const bcrypt = require('bcrypt');
const Usuario = require('../models/usuario');
const { verificarToken,verificarAdmin } = require('../middlewares/autenticacion');
const _ = require('underscore');



const app = express();


 app.get('/usuario',[verificarToken,verificarAdmin],(req, res)=> {
    
    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 20;
    limite = Number(limite);
  Usuario.find({estado:true },'nombre email role google img')
  .skip(desde)
  .limit(limite)
  .exec((err,usuarios)=>{
    if(err){
        return res.status(400).json({
            ok: false,
            err
        })
    }
    Usuario.count({estado:true},(err,cuantos)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            usuarios,
            cantidad:cuantos
        })
    })
    
  })
  })
  
  app.post('/usuario',[verificarToken,verificarAdmin], (req, res)=> {
      let body = req.body;
      

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password:bcrypt.hashSync(body.password,10),
            role: body.role
        })

        usuario.save((err,usuarioDB)=>{
            if(err){
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok:true,
                usuario:usuarioDB
            })

        });
      
  })
  
  app.put('/usuario/:id',[verificarToken,verificarAdmin],(req, res)=> {
      let id = req.params.id;
      let body = _.pick(req.body,['nombre','email','password','img'])

      Usuario.findByIdAndUpdate(id,body,{new:true,},(err,usuarioDB) =>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            usuario:usuarioDB
        }
        )
      });

  })
  
  app.delete('/usuario/:id', [verificarToken,verificarAdmin], (req, res)=> {
      /*let id = req.params.id;
      
      Usuario.findByIdAndDelete(id,(err,usuarioBorrado)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
        }
        if(!usuarioBorrado){
            return res.status(400).json({
                ok: false,
                err:{
                    message:'Usuario no encontrado'
                }
            })
        }

        res.json({
            ok:true,
            usuarioBorrado
        })
        
      })*/

      let id = req.params.id;
      let cambioEstado = {
          estado:false
      }
      Usuario.findByIdAndUpdate(id,cambioEstado,(err,usuario)=>{
        if(err){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if(!usuario){
            return res.status(400).json({
                ok: false,
                err
            })
        }
        res.json({
            ok:true,
            usuario
        })
    })
})

module.exports = app;