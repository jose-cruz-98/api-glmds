const ProCarriers = require('../models/pro_carriers.models');
const helper = require('../utils/helpers');
const mongoose = require('mongoose')

exports.addCarrier = async (req, res, next) => {
    const body = req.body;
    body.dRegistered = helper.getDayAndHour();

    try{
        const proCarriers = new ProCarriers(body);
        await proCarriers.save();
        let carriers = await ProCarriers.find({_tReference : mongoose.Types.ObjectId(body._tReference)});

        res.status(200).json({
            msg : `La transportista se agrego con exito.`,
            carriers : carriers
        });
        
    }catch(err){
        console.log("Error in add : ", err);
    }
}

exports.getCarriers = async (req, res, next) => {
    const {query} = req;
    try{
        let carriers = await ProCarriers.find(query);

        if(Object.keys(carriers).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        return res.status(200).json({carriers});
        
    }catch(err){
        console.log("Error in : ", err)
    }
}

exports.addImagenMonitoring = async (req, res, next) => {
    const body = req.body;
    var proDocuments;

    let imagen = {
        tNote : body.tNote,
        tUri : req.file.destination + "/" + req.file.filename,
        dRegistered : helper.getDayAndHour()
    }

    try{      
        await ProCarriers.updateOne({_id : mongoose.Types.ObjectId(body._idCarrier)},
            {$push : {aImages : imagen}});

        let carriers = await ProCarriers.find({_id : mongoose.Types.ObjectId(body._idCarrier)});

        res.status(200).json({
            msg : `La imagen se guardo con éxito.`,
            carriers : carriers
        });
    }catch(err){
        console.log("Error in : ", err);
    }
}