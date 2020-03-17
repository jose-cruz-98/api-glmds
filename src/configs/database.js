const mongoose = require('mongoose');

const url = require('./properties').DB;

module.exports = () => {
    mongoose.connect(url, {
        useNewUrlParser : true,
        useUnifiedTopology : true,
        useCreateIndex : true
    })
    .then(() => console.log('Mongo Connected! on', url))
    .catch(err => console.log('Error in database.js : ', err))

    process.on('SIGINT', () => {
        mongoose.connection.close(() => {
            console.log('Mongo is disconnected...');
            process.exit(0)
        })
    })
}