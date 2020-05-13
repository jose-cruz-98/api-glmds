const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    _tUserFrom : {
        type : Schema.Types.ObjectId,
        ref : 'pro_users'
    },
    _tUserTo : {
        type : Schema.Types.ObjectId,
        ref : 'pro_users'
    },
    tAmount : {
        type : String,
        required : true
    },
    tTypePayment : {
        type : String,
        required : true
    },
    tObservation : String,
    tObservationReturned : String,
    aAttachedFrom : [String],
    aAttachedTo : {
        type : Schema.Types.ObjectId,
        ref : 'pro_documents'
    },
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
});

const model = mongoose.model('pro_requests', schema);
module.exports = model;