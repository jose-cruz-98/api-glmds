const ProEvidences = require('../models/pro_evidences.models');
// const mongoose = require('mongoose')
const helper = require('../utils/helpers');
// const path = require('path')
// const fs = require('fs')

exports.addEvidences = async (req, res, next) => {
    const {body, _idUser} = req;
    const files = req.files;

    let aFiles = [];

    if(Object.keys(files).length !== 0){
        files.map(file => {
            aFiles.push(`${file.destination}/${file.filename}`);
        })
    }

    let data = {
        _tReference : body._tReference,
        aEvidence : {
            tNote : body.tNote,
            aUri : aFiles,
            dRegistered : helper.getDayAndHour()
        }
    }
   
    try{
        let exist = await ProEvidences.findOne({_tReference : body._tReference});
        if(exist === null){
            proEvidences = new ProEvidences(data);
            await proEvidences.save();
        }else{
            await ProEvidences.updateOne({_id : exist._id},
                {$push : {aEvidence : data.aEvidence}});
        }
            
        let evidences = await ProEvidences.find({_tReference : body._tReference});

        res.status(200).json({
            msg : `Las evidencias se guardaron con éxito.`,
            evidences : evidences
        });
    }catch(err){
        console.log("Error in : ", err);
    }
}

exports.getEvidence = async (req, res) => {
    const query = req.query;

    try{
        let evidences = await ProEvidences.find({_tReference : query._tReference});

        if(Object.keys(evidences).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }
        
        return res.status(200).json({evidences});
        
    }catch(err){
        console.log("Error in : ", err)
    }
}