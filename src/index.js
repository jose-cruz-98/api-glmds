const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const db = require('./configs/database');
const port = require('./configs/properties').PORT;

/// DATABASE
db();

/// SERVER
const app = express();

/// SET
app.set('port', process.env.PORT || port);

/// CONFIG
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

/// ROUTES
app.use('/', (req, res) => {
    res.json({msg : "API of Grupo Logistica Mares Del Sur S.A de C.V"})
})

/// START
app.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
})