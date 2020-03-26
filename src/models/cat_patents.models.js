const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    tAgent : {
        type : String,
        required : true
    },
    iPatent : {
        type : Number,
        required : true
    },
    tDirecction : String,
    tPhone : String
});

const model = mongoose.model('cat_patents', schema);
module.exports = model;