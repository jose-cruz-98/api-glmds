const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    tName : {
        type : String,
        required : true
    }
});

const model = mongoose.model('cat_shipping_companies', schema);
module.exports = model;