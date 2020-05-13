const ProEvents = require('../models/pro_events.models');
const ProNotifications = require('../models/pro_notifications.models');
const ProUsers = require('../models/pro_users.models')

const helper = require('../utils/helpers');
const app = require('../index');

exports.addEvent = async (req, res, next) => {
    const {body, _idUser} = req;

    try{
        const proUser = await ProUsers.findOne({_id : _idUser});

        const notification = {
            _tUser : _idUser,
            tRole : body.tPrivate === "TRUE" ? ["PRIVADO"] : ["DIRECCION","ADMINISTRACION","OPERACIONES","RECURSOS HUMANOS","FACTURACION","SISTEMAS","PRIVADO", "ADMINISTRADOR GENERAL"],
            tMessage : `${proUser.tName} ${proUser.tSurname} ha ingresado una recuperacion de garantias con fecha ${body.tStart}.`,
            tGoTo : "/ls/import/inspection-point-and-emptiness/warranty-recovery",
            dRegistered : helper.getDayAndHour(),
            tAlert : helper.getDateOfYesterday(body.tStart)
        }

        const proEvents = new ProEvents(body);
        await proEvents.save();

        const proNotification = new ProNotifications(notification);
        await proNotification.save();

        proNotifications = await ProNotifications.find({}).sort({_id : -1}).limit(50);
        app.io.emit("getNotifications", proNotifications);

        let events = await ProEvents.find({_tReference : body._tReference});

        events = setEvents(events);

        res.status(200).json({
            msg : `La fecha ${body.tStart} con el titulo "${body.tTitle}", se guardo con exito.`,
            events
        });
        
    }catch(err){
        console.log("Error in add : ", err);
    }
}

exports.getEvents = async (req, res, next) => {
    const {query} = req;

    try{
        let events = await ProEvents.find(query);

        if(Object.keys(events).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        events = setEvents(events);

        return res.status(200).json({events});
        
    }catch(err){
        console.log("Error in : ", err)
    }
}

setEvents = (events) => {
    return events.map(event => {
        return{
            title : event.tTitle,
            start : event.tStart,
            end : event.tEnd,
            id : event._id,
            extendedProps: {
                _tReference : event._tReference
            }
        }
    })
}