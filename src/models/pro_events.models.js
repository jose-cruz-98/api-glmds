const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    tTitle : {
        type : String,
        required: true
    },
    tStart : {
        type : String,
        required : true
    },
    tEnd : String

});

const model = mongoose.model('pro_events', schema);
module.exports = model;