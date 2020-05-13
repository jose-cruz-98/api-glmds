const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    _tReference : {
        type : Schema.Types.ObjectId,
        ref : 'pro_import_references'
    },
    aEvidence : [{
        tNote : String,
        aUri : [String],
        dRegistered : String
    }]
});

const model = mongoose.model('pro_evidences', schema);
module.exports = model;