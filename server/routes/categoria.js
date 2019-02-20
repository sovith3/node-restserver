const express = require('express');

const {verificarToken,verificarAdmin} = require('../middlewares/autenticacion')

const _ = require('underscore');

const Categoria = require('../models/categoria');

const app = express();



//MOSTRAR TODAS LAS CATEGORIAS

app.get('/categoria',(req,res)=>{
    Categoria.find({})
    .sort('descripcion')
    .populate('usuario','nombre email')
    .exec((err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.status(200).json({
            ok:true,
            categoriaBD
        })
    })
});

//MOSTRAR UNA CATEGORIA POR ID

app.get('/categoria/:id',(req,res)=>{
    let id = req.params.id;
    Categoria.findById(id,(err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }

        res.status(400).json({
            ok:true,
            categoriaBD
        })
    })
});

//Crear nueva Categoria

app.post('/categoria', verificarToken,(req,res)=>{
    //regresa la nueva categoria
    //req.usuario._id
    let body = req.body;
    console.log(body);
    let categoria = new Categoria();

    categoria.descripcion = body.descripcion;
    categoria.usuario = req.usuario._id;
    categoria.save((err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            categoriaBD
        })
    });
});

//ACTUALIZAR UNA  CATEGORIA

app.put('/categoria/:id',(req,res)=>{
    let id = req.params.id;
    let body = _.pick(req.body,['descripcion']);
    Categoria.findByIdAndUpdate(id,body,{'new':true},(err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                ok:false,
                err
            })
        }
        res.status(200).json({
            ok:true,
            categoriaBD
        })
    })
});

//Eliminar una categoria

app.delete('/categoria/:id',[verificarToken,verificarAdmin],(req,res)=>{
    
    let id = req.params.id;

    Categoria.findByIdAndRemove({_id:id},(err,categoriaBD)=>{
        if(err){
            return res.status(400).json({
                o:false,
                err
            })
        }
        if(!categoriaBD){
            return res.status(500).json({
                ok:true,
                err:{
                    message:'El id no existe'
                }
            })
        }
        res.json({
            ok:true,
            err:{
                message:`La categoria ${categoriaBD.descripcion} a sido eliminada`
            }
        })
    })

    //solo un administrador puede borrar categorias

    //Categoria.findByIDAndRemove

});

module.exports = app;