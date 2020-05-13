const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const socketIO = require('socket.io');
const http = require('http');

const db = require('./configs/database');
const port = require('./configs/properties').PORT;

// CONTROLLERS
const notifications = require('./controllers/notifications.controller')

/// DATABASE
db();

/// SERVER
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

/// SET
app.set('port', process.env.PORT || port);

/// CONFIG
app.use(cors());
app.use(morgan('dev'));
app.use(express.urlencoded({extended : false}));
app.use(express.json());

/// ROUTES
app.use('/api/v1', require('./routes/post.routes')); // POST
app.use('/api/v1', require('./routes/get.routes')); // GET
app.use('/api/v1', require('./routes/upload.routes')); // PUT
app.use('/api/v1', require('./routes/delete.routes')); // DELETE
app.use('/', (req, res) => {
    res.json({msg : "API of Grupo Logistica Mares Del Sur S.A de C.V"})
})

io.on("connection", socket => {
    console.log("Client ID: ", socket.id);
    notifications.getNotifications();
});

/// START
server.listen(app.get('port'), () => {
    console.log('Server on port ', app.get('port'));
})

module.exports.app = app;
module.exports.io = io;