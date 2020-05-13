const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    tCarrier : {
        type : String,
        required : true
    },
    tLicensePlate : {
        type : String,
        required : true
    },
    tOperator : {
        type : String,
        required : true
    },
    tContact : {
        type : String,
        required : true
    },
    tCaat : {
        type : String,
        required : true
    },
    tTypeCarrier : {
        type : String,
        required : true
    },
    aImages : [{
        tNote : String,
        tUri : String,
        dRegistered : String
    }],
    tName : String,
    tLicensePlateCustody : String,
    dRegistered : {
        type:String,
        required:true
    }
});

const model = mongoose.model('pro_carriers', schema);
module.exports = model;