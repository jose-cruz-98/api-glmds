const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    tReference : {
        type : String,
        required : true
    },
    tEta : [{
        type : String,
        required : true
    }],
    tBl : {
        type : String,
        required : true
    },
    tImportKey :{
        type : String,
        required : true,
        enum : ["A1", "A4"],
        default : "A1"
    },
    _idPatent : {
        type : Schema.Types.ObjectId,
        ref : 'cat_patents'
    },
    _idShippingCompany : {
        type : Schema.Types.ObjectId,
        ref : 'cat_shipping_companies'
    },
    _idUser : {
        type : Schema.Types.ObjectId,
        ref : 'pro_users'
    },
    tImporter : {
        type : String,
        required : true
    },
    tTariffFraction : {
        type : String,
        required : true
    },
    tProduct : {
        type : String,
        required : true
    },
    tOrigin : {
        type : String,
        required : true
    },
    tDestination : {
        type : String,
        required : true
    },
    tClient : {
        type : String,
        required : true
    },
    tObservation :  String,
    tContainer : [{
        type : String,
        required : true
    }],
    tStatus : {
        type : String,
        enum : ["Pendiente", "Revalidado", "Programada", "Pagado"],
        default : "Pendiente"
    },
    aDocuments : [{
        tName : String,
        tUri : String,
        dRegistered : String,
        tStatus : {
            type : String,
            enum : ["Revalidado", "Programada", "Pagado"],
            default : "Revalidado"
        }
    }],
    tPrivate : String,
    dRegistered : {
        type : Date,
        default : Date.now
    }
});

const model = mongoose.model('pro_import_references', schema);
module.exports = model;