const CatPatent = require('../models/cat_patents.models');

exports.addPatent = async (req, res, next) => {
    const body = req.body;

    try{
        const catPatent = new CatPatent(body);

        const isSaved = catPatent.save();
        
        if(isSaved){
            res.status(200).json({msg : `La patente ${body.iPatent} se guardo con éxito.`});
        }
    }catch(err){
        console.log("Error in addPatent : ", err);
    }
}

exports.getPatent = async(req, res, next) => {
    const query = req.query;

    try{
        let patents = await CatPatent.find(query);

        if(Object.keys(patents).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        return res.status(200).json({patents});
        
    }catch(err){
        console.log("Error in getPatent : ", err)
    }
}