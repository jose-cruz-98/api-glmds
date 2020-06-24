const ProNotifications = require('../models/pro_notifications.models');
const app = require('../index');

exports.getNotifications = async (socket) => {
    try{
        proNotifications = await ProNotifications.find({}).sort({_id : -1}).limit(50);
        app.io.emit("getNotifications", proNotifications);
    }catch(err){
        console.log(err)
    }
    
}

exports.delNotification = async(req, res) => {
    const id = req.query;

    try{
        await ProNotifications.deleteOne({_id : id});

        proNotifications = await ProNotifications.find({}).sort({_id : -1}).limit(50);
        app.io.emit("getNotifications", proNotifications);

        res.status(200).json({
            msg : `La notificacion se elimino con éxito.`
        });      
    }catch(err){
        res.status(404).json({msg : `El notificacion no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}