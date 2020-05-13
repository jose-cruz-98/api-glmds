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