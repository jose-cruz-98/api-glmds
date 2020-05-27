const ProPersonal = require('../models/pro_personal.models');
const helper = require('../utils/helpers')

exports.addCategory = async (req, res, next) => {
    const body = req.body;

    let data = {
        tCategory : body.tCategory,
        aDocuments : []
    }
    try{
        const proPersonal = new ProPersonal(data);

        await proPersonal.save();

        let categories = await ProPersonal.find({});
        
        res.status(200).json({
            msg : `La categoria "${body.tCategory}", se guardo con éxito.`,
            categories : categories
        });
    }catch(err){
        console.log("Error: ", err);
    }
}

exports.getCategories = async(req, res, next) => {
    const query = req.query;

    try{
        let categories = await ProPersonal.find(query);

        if(Object.keys(categories).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        return res.status(200).json({categories});
        
    }catch(err){
        console.log("Error in getPatent : ", err)
    }
}

exports.addFileToCategory = async (req, res, next) => {
    const body = req.body;

    let documents = {
        tName : body.tName,
        tNote: body.tNote,
        tUri : req.file.destination + "/" + req.file.filename,
        dRegistered : helper.getDayAndHour()
    }

    try{
        await ProPersonal.updateOne({_id : body._tCategory},
            {$push : {aDocuments : documents}});
            
        let categories = await ProPersonal.find({});

        res.status(200).json({
            msg : `El documento ${body.tName} se guardo con éxito.`,
            categories : categories
        });
    }catch(err){
        console.log("Error in : ", err);
    }
}