const express = require('express');

const {verificarToken,verificarAdmin} = require('../middlewares/autenticacion')

const  app = express();

const Producto = require('../models/producto');
//let Categoria = require('../models/categoria');

//LISTAR PRODUCTOS
//PUPULATE
//PAGINAR
app.get('/producto',(req,res)=>{
    let limite = Number(req.query.limite);zd
    let desde = Number(req.query.desde);
    Producto.find({disponible:true})
    .limit(limite)
    .skip(desde)
    .populate('usuario categoria')
    .exec((err,productoBD)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            productoBD
        })
    })
})

//LISTAR UN PRODUCTO
//POPULATE
app.get('/producto/:id',(req,res)=>{
    let id = req.params.id;
    Producto.findById(id,(err,productoBD)=>{
        if(err){
            return res.json({
                ok:false,
                productoBD
            })
        }
    })

})


//BUSCAR UN PRODUCTO

app.get('/producto/buscar/:termino',verificarToken,(req,res)=>{
    let termino = req.params.termino;
    let regex = new RegExp(termino,'i');

    Producto.find({nombre:regex})
    .populate('categoria','descripcion')
    .exec((err,productoBD)=>{
        if(err){
            return res.status(500).json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            productoBD
        })

    })
})
    

//CREAR UN PRODUCTO
app.post('/producto',verificarToken,(req,res)=>{

    let body = req.body;
    let producto = new Producto();
    //let categoria = new Categoria();

    /*let categoriaId;
    categoria.find({nombre:body.categoria},(err,categoriaBD)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        if(!categoriaBD){
            return res.json({
                ok:false,
                err:{
                    message: 'Categoria no encontrada'
                }
            })
        }
        categoriaId = categoriaBD._id;
    })*/



    producto.nombre = body.nombre;
    producto.precioUni = body.precio;
    producto.descripcion = body.descripcion;
    //producto.categoria = categoriaId;
    producto.categoria = body.categoria;
    producto.usuario = req.usuario._id;
    producto.disponible = true;
    

    producto.save((err,productoBD)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        if(!productoBD){
            return res.json({
                ok:false,
                err:{
                    message:'No se puede almacenar'
                }
            })
        }
        res.json({
            ok:true,
            productoBD
        })
    })
    //grabar el usuario
    //grabar una categoria del listado

})

//ACTUALIZAR UN PRODUCTO
app.put('/producto/:id',(req,res)=>{
    let id = req.params.id;
    console.log(id);
    let body = req.body;
    Producto.findByIdAndUpdate(id,body,{'new':true},(err,productoBD)=>{
        if(err){
            return res.json({
                ok:false,
                productoBD
            })
        }
        res.json({
            ok:true,
            productoBD
        })
    })

})
//Borrar un Producto
app.delete('/producto/:id',(req,res)=>{
    let id = req.params.id

    Producto.findOneAndUpdate(id,{disponible:false},{'new':true},(err,productoBD)=>{
        if(err){
            return res.json({
                ok:false,
                err
            })
        }
        res.json({
            ok:true,
            productoBD
        })
    })

    //Cambiar disponibilidad
})

module.exports = app;