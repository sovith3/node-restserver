const jwt = require('jsonwebtoken');

let verificarToken = (req , res , next)=>{
    let token = req.get('token');
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })
};

let verificarAdmin = (req,res,next)=>{
    let usuario = req.usuario;
    console.log(usuario);
    if(usuario.role === 'ADMIN_ROLE'){
        next();
    }else{
        return res.status(401).json({
            ok:false,
            err:{
                message:'El usuario debe de ser administrador'
            }
        })
    }
}

let verificarTokenImg = (req,res,next)=>{
    let token = req.query.token;
    jwt.verify(token,process.env.SEED,(err,decoded)=>{
        if(err){
            return res.status(401).json({
                ok:false,
                err
            })
        }
        req.usuario = decoded.usuario;
        next();
    })

}
module.exports = {
    verificarToken,
    verificarAdmin,
    verificarTokenImg
};