const express = require('express');

const fs = require('fs');

const path = require('path');

let app = express();

const {verificarTokenImg}= require('../middlewares/autenticacion');

app.get('/imagen/:tipo/:img',verificarTokenImg,(req,res)=>{

    let tipo = req.params.tipo;
    let img = req.params.img;

    let pathImagen = path.resolve(__dirname,`../../uploads/${tipo}/${img}`);
    if(fs.existsSync(pathImagen)){
        res.sendFile(pathImagen)
    }else{
        let noImagen = path.resolve(__dirname,'../assets/no-image.jpg');
        res.sendFile(noImagen);
    }
})


module.exports = app;