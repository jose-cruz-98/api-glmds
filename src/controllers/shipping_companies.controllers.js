const CatShippingCompany = require('../models/cat_shipping_companies.models');

exports.addShippingCompany = async (req, res, next) => {
    const body = req.body;

    try{
        const catShippingCompany = new CatShippingCompany(body);

        const isSaved = catShippingCompany.save();
        
        if(isSaved){
            res.status(200).json({msg : `La naviera ${body.tName} se guardo con éxito.`});
        }
    }catch(err){
        console.log("Error in addShippingCompany : ", err);
    }
}

exports.getShippingComapny = async(req, res, next) => {
    const query = req.query;

    try{
        let shippingCompanies = await CatShippingCompany.find(query);

        if(Object.keys(shippingCompanies).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        return res.status(200).json({shippingCompanies});
        
    }catch(err){
        console.log("Error in getShippingCompany : ", err)
    }
}