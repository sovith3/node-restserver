const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion:{
        type:String,
        unique:true,
        required:[true, 'La descripcion es requerida']
    },
    usuario:{
        type:Schema.Types.ObjectId,
        ref:'Usuario'
    }
});

    /*categoriaSchema.methods.toJSON = function(){
        let user = this;
        let userObjet = user.toObject();
        delete userObjet.password;
        return userObjet;
    };*/

    categoriaSchema.plugin(uniqueValidator,{message:'{PATH} debe de ser unico'});
    module.exports = mongoose.model('Categoria',categoriaSchema);