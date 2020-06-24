const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tUser : {
        type : Schema.Types.ObjectId,
        ref : 'pro_users'
    },
    _tUserTo : {
        type : Schema.Types.ObjectId,
        ref : 'pro_users'
    },
    tRole : [{
        type : String,
        enum : ["DIRECCION","ADMINISTRACION","OPERACIONES","RECURSOS HUMANOS","FACTURACION","SISTEMAS","PRIVADO", "ADMINISTRADOR GENERAL"],
        required : true
    }],
    tMessage : {
        type : String,
        required : true
    },
    tGoTo : {
        type : String,
        required : true
    },
    dRegistered : {
        type:String,
        required:true
    },
    tAlert : String,
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    tReference : String

});

const model = mongoose.model('pro_notifications', schema);
module.exports = model;