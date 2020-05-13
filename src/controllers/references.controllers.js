const ProImportReferences = require('../models/pro_import_references.models');
const ProNotifications = require('../models/pro_notifications.models');
const ProUsers = require('../models/pro_users.models')

const helper = require('../utils/helpers')
const app = require('../index');

exports.addImportReference = async (req, res, next) => {
    const {body, _idUser} = req;
    body["_idUser"] = _idUser;

    try{
        const proUser = await ProUsers.findOne({_id : _idUser});

        const notification = {
            _tUser : _idUser,
            tRole : body.tPrivate === "TRUE" ? ["PRIVADO"] : ["DIRECCION","ADMINISTRACION","OPERACIONES","RECURSOS HUMANOS","FACTURACION","SISTEMAS","PRIVADO", "ADMINISTRADOR GENERAL"],
            tMessage : `${proUser.tName} ${proUser.tSurname} ha ingresado una nueva referencia.`,
            tGoTo : "/ls/import/references/add",
            dRegistered : helper.getDayAndHour(),
        }
        
        const proImportReferences = new ProImportReferences(body);
        await proImportReferences.save();

        const proNotification = new ProNotifications(notification);
        await proNotification.save();

        proNotifications = await ProNotifications.find({}).sort({_id : -1}).limit(50);
        app.io.emit("getNotifications", proNotifications);

        let references = await findReferenes({});
        res.status(200).json({
            msg : `La referencia ${body.tReference} se guardo con éxito.`,
            references : references
        });
        
    }catch(err){
        console.log("Error in add : ", err);
    }
}

exports.getImportReference = async(req, res, next) => {
    const query = req.query;

    try{
        let references = await findReferenes(query);

        if(Object.keys(references).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        return res.status(200).json({references});
        
    }catch(err){
        console.log("Error in : ", err)
    }
}

exports.updImportReference = async(req, res,next) => {
    const {body} = req;
    const _id = body._id;

    // delete body["dRegistered"];
    delete body["_id"];
    // delete body["__v"];

    try{
        await ProImportReferences.findByIdAndUpdate({_id : _id}, body);

        let references = await findReferenes({});

        res.status(200).json({
            msg : `La referencia ${body.tReference} se actualizo con éxito.`,
            references : references
        });
    }catch(err){
        console.log("Error in : ", err)
    }
}

exports.updStateImportReference = async(req, res) => {
    const {body} = req;

    const data = {
        tStatus :  body.tStatus,
        $push : {
                aDocuments : {
                    tName : body.tName,
                    tUri : req.file.destination + "/" + req.file.filename,
                    dRegistered : helper.getDayAndHour(),
                    tStatus : body.tStatus
                }
            }
    }

    try{
        await ProImportReferences.findOneAndUpdate({tReference : body._tReference}, data);

        let references = await findReferenes({});

        res.status(200).json({
            msg : `La referencia ${body._tReference} se actualizo con éxito.`,
            references : references
        });
    }catch(err){
        console.log("Error in : ", err)
    }
}

exports.addEta = async (req, res) => {
    const {body} = req;

    const data = {$push : { tEta : body.tEta}}

    try{
        await ProImportReferences.findOneAndUpdate({tReference : body._tReference}, data);

        let references = await findReferenes({});

        res.status(200).json({
            msg : `La eTA ${body.tEta} se agrego con éxito.`,
            references : references
        });
    }catch(err){
        console.log("Error in : ", err)
    }
}

findReferenes = async(query) => {
    try{
        let row = await ProImportReferences.aggregate([
            {
                $lookup : {
                    from : "cat_patents",
                    localField :  "_idPatent",
                    foreignField : "_id",
                    as : "aPatent"
                }
            },{
                $lookup : {
                    from : "cat_shipping_companies",
                    localField :  "_idShippingCompany",
                    foreignField : "_id",
                    as : "aShippingCompany"
                }
            },{
                $lookup : {
                    from : "pro_users",
                    localField :  "_idUser",
                    foreignField : "_id",
                    as : "aUsers"
                }
            },{
                $sort : {
                    _id : -1
                }
            },{
                $match : query
            }
    
        ])
    
        for (let i = 0; i < row.length; i++) {
            row[i].dRegistered = helper.convertDayAndHour(row[i].dRegistered);       
        }
    
        return row
    }catch(err){
        console.log("Error in : ", err)
    }
}