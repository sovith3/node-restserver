const express = require('express');
const fileUpload = require('express-fileupload');
const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const app = express();

const fs = require('fs');
const path = require('path');

// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', (req, res)=> {

   let tipo = req.params.tipo;
   let id = req.params.id;

  if (Object.keys(req.files).length == 0) {
    return res.status(400).json({
        ok:false,
        error:{
            message:'No se seleccionó ningun archivo'
        }
    })
  }

  // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
  let archivo = req.files.archivo;
  let nombreCortado = archivo.name.split('.');
  let ext = nombreCortado[nombreCortado.length - 1];

  let extencionesPermitidas = ['jpg','png','gif','jpeg'];
  console.log(ext);
  if(extencionesPermitidas.indexOf(ext)<0){
      return res.status(400).json({
          ok:false,
          err:{
              message:'Las extenciones permitidas son ' + extencionesPermitidas.join(', ')
          }
      })
  }

  let tiposPermitidos = ['usuarios','productos'];

  if(tiposPermitidos.indexOf(tipo)<0){
      return res.status(400).json({
          ok:false,
          err:{
              message:'Los tipos permitidos son: ' + tiposPermitidos.join(', ')
          }
      })
  }

let nombreArchivo = `${id}-${new Date().getMilliseconds()}.${ext}`;

  // Use the mv() method to place the file somewhere on your server
  archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err)=> {
    if (err)
      return res.status(500).json({
          ok:false,
          err
      })

    switch(tipo){
        case 'usuarios':
        imagenUsuario(id,res,nombreArchivo);
        break;
        case 'productos':
        imagenProducto(id,res,nombreArchivo);
        break;
        default:
        break;
    }
        
      //LA IMAGHEN SE CARGO
      
  });
});


function imagenUsuario(id,res,nombreArchivo){

    Usuario.findById(id,(err,usuarioBD)=>{
        if(err){
            borrarImagen(nombreArchivo,'usuarios');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        if(!usuarioBD){
            borrarImagen(nombreArchivo,'usuarios');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error usuario no encontrado'
                }
            })
        }

        borrarImagen(usuarioBD.img,'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err,usuarioGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                usuarioGuardado
            })
        })


    })


}

function imagenProducto(id,res,nombreArchivo){

    Producto.findById(id,(err,productoBD)=>{
        if(err){
            borrarImagen(nombreArchivo,'productos');
            return res.status(500).json({
                ok:false,
                err
            })
        }
        
        if(!productoBD){
            borrarImagen(nombreArchivo,'productos');
            return res.status(400).json({
                ok:false,
                err:{
                    message:'Error producto no encontrado'
                }
            })
        }

        borrarImagen(productoBD.img,'productos');

        productoBD.img = nombreArchivo;
        productoBD.save((err,productoGuardado)=>{
            if(err){
                return res.status(500).json({
                    ok:false,
                    err
                })
            }

            res.json({
                ok:true,
                productoGuardado
            })
        })
    })


}
function borrarImagen(imagen,tipo){
    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${imagen}`);
    if(fs.existsSync(pathImagen)){
        fs.unlinkSync(pathImagen);
    }else{
        console.log('LA IMAGEN NO EXISTE');
    }
}

module.exports = app;