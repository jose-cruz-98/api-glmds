const jwt = require('jsonwebtoken');
const secret = require('../configs/properties').SECRET;

exports.validateToken = (req, res, next) => {
    const bearerHeader = req.headers['authorization'];

    if(typeof(bearerHeader) !== 'undefined'){
        const bearer = bearerHeader.split(" ");
        let token = bearer[1];

        try {
            isValid = jwt.verify(token, secret);
            next();
        } catch (err) {
            res.status(403).json({msg : "Token incorrecto. Inicie sesión nuevamente."});
            console.log("Error in middlewares : ", err)
        }

    }else{
        res.status(403).json({msg : "No tienes los permisos necesarios para acceder."});
    }
}