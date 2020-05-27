const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    tCategory : String,
    aDocuments : [
        {
            tName : String,
            tNote : String,
            tUri : String,
            tRegistered  : String
        }
    ]
});

const model = mongoose.model('pro_personal', schema);
module.exports = model;