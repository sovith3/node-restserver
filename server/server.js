require('../config/config');
const express = require('express')
const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
 
// parse application/json
app.use(bodyParser.json())
 
app.get('/usuario/:id', function (req, res) {
  let id = req.params.id;
  res.json({
    id
  }
)
})

app.post('/usuario/:id', function (req, res) {
    let body = req.body;
    if(body.nombre === undefined){
        res.status(400).json({
            ok:false,
            mensaje:'No se encuentra la solicitud',
        });
    }else{
        res.json({
            persona:body
        }
        )
    }
    
})

app.put('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    }
    )
})

app.delete('/usuario/:id', function (req, res) {
    let id = req.params.id;
    res.json({
        id
    }
    )
})
  
app.listen(process.env.PORT,()=>{
    console.log('Escuchando el puerto ',process.env.PORT);
});