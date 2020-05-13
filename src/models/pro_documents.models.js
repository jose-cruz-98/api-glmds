const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    aDocuments : [{
        tName : {
            type : String,
            required : true
        },
        tUri : {
            type:String,
            required:true
        },
        tOperation : {
            type:String,
            required:true,
            enum : ["IMPORTACION", "EXPORTACION"]
        },
        tTypeDocument : {
            type : String,
            required : true,
            enum : ["DOCUMENTOS", "PAGOS", "PUNTO DE INSPECCION Y VACIOS"],
            default : "DOCUMENTOS"
        },
        tNote : [String],
        tStatus : {
            type:String,
            required : true,
            enum : ["PENDIENTE", "REVISION", "DEVUELTO", "COMPLETADO"],
            default : "PENDIENTE"
        },
        dRegistered : {
            type:String,
            required:true
        }
    }]
});

const model = mongoose.model('pro_documents', schema);
module.exports = model;