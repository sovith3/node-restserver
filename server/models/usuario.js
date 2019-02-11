const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let rolesValidos = {
    values:['ADMIN_ROLE','USER_ROLE'],
    menssage:'{VALUE} no es un rol válido'
}

let usuarioSchema = new Schema({
    nombre:{
        type:String,
        required:[true, 'El nombre es requerido']
    },
    email:{
        unique:true,
        type:String,
        required:[true, 'El imail es requerido']
    },
    password:{
        type:String,
        required:[true,'La contraseña es oblicatoria']
    },
    img:{
        type:String,
        required:false,
    },
    role:{
        type:String,
        default:'USER_ROLE',
        enum:rolesValidos
    },
    estado:{
        type:Boolean,
        default:true
    },
    google:{
        type:Boolean,
        default: false
    }
});

    usuarioSchema.methods.toJSON = function(){
        let user = this;
        let userObjet = user.toObject();
        delete userObjet.password;
        return userObjet;
    };

    usuarioSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});
    module.exports = mongoose.model('Usuario',usuarioSchema);