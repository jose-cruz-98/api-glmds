const ProRequests = require('../models/pro_requests.models');
const ProDocuments = require('../models/pro_documents.models');
const ProNotifications = require('../models/pro_notifications.models');
const ProImportReferences = require('../models/pro_import_references.models');
const ProUsers = require('../models/pro_users.models');

const helper = require('../utils/helpers');
const mongoose = require('mongoose')
const fs = require('fs');
const app = require('../index');

exports.addRequest = async (req, res, next) => {
    const {body, _idUser} = req;
    const files = req.files;

    let aFiles = [];

    if(Object.keys(files).length !== 0){
        files.map(file => {
            aFiles.push(`${file.destination}/${file.filename}`);
        })
    }

    body.dRegistered = helper.getDayAndHour();
    body.aAttachedFrom = aFiles;

    try{
        const proUser = await ProUsers.findOne({_id : _idUser});
        const proUserTo = await ProUsers.findOne({_id : body._tUserTo});
        const proImportReferences = await ProImportReferences.findOne({_id : body._tReference});

        const notification = {
            _tUser : _idUser,
            tRole : proImportReferences.tPrivate === "TRUE" ? ["PRIVADO"] : ["DIRECCION","ADMINISTRACION","OPERACIONES","RECURSOS HUMANOS","FACTURACION","SISTEMAS","PRIVADO", "ADMINISTRADOR GENERAL"],
            tMessage : `${proUser.tName} ${proUser.tSurname} ha solicitado un "${body.tTypePayment}" a ${proUserTo.tName} ${proUserTo.tSurname}.`,
            tGoTo : "/ls/import/payments",
            dRegistered : helper.getDayAndHour(),
        }

        const proRequests = new ProRequests(body);
        await proRequests.save();

        const proNotification = new ProNotifications(notification);
        await proNotification.save();

        proNotifications = await ProNotifications.find({}).sort({_id : -1}).limit(50);
        app.io.emit("getNotifications", proNotifications);

        let requests = await joinRequest({_tReference : mongoose.Types.ObjectId(body._tReference)})

        res.status(200).json({
            msg : `La solicitud se ha realizado con exito.`,
            requests : requests
        });
        
    }catch(err){
        console.log(err)
    }
}

exports.getRequest = async (req, res) => {
    let query = req.query;
    try{

        let requests = await joinRequest({_tReference : mongoose.Types.ObjectId(query._tReference)});

        if(Object.keys(requests).length === 0){
            return res.status(404).json({msg : "No se encontraron datos"});
        }

        res.status(200).json(requests)
     
    }catch(err){
        res.status(404).json({msg : `El documento no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}

exports.delRequest = async(req, res) => {
    const id = req.query;

    try{
        let request = await ProRequests.find({_id : id});

        console.log(request)

        let uris = request[0].aAttached;

        if(Object.keys(uris).length !== 0){
            uris.map(async (uri) => {
                await findAndDeleteFile(uri);
            });
        }

        await ProRequests.deleteOne({_id : id});

        request = await joinRequest({_tReference : mongoose.Types.ObjectId(request[0]._tReference)});

        res.status(200).json({
            msg : `La solicitud se elimino con éxito.`,
            requests : request
        });      
    }catch(err){
        res.status(404).json({msg : `El documento no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}

exports.updReturnedDocument = async(req, res) => {
    const body = req.body;
    const _tReference = body._tReference;
    const _aDocuments = body._aDocuments;
    const tUri = body.tUri;

    delete body._tReference
    delete body._aDocuments
    delete body.tUri

    try{

        await ProDocuments.updateOne({"aDocuments._id" : _aDocuments},
                {$pull : {aDocuments :{ _id : _aDocuments}}});
        
        await findAndDeleteFile(tUri)

        await ProRequests.update({_tReference : mongoose.Types.ObjectId(_tReference)}, body);

        let request = await joinRequest({_tReference : mongoose.Types.ObjectId(_tReference)});

        res.status(200).json({
            msg : `La solicitud se devolvio con éxito.`,
            requests : request
        }); 
    }catch(err){
        console.log(err)
    }
}

exports.addRequestFile = async (req,res) => {
    const {body} = req;

    let file = {
        tName : body.tName,
        tUri : req.file.destination + "/" + req.file.filename,
        tOperation : body.tOperation,
        tTypeDocument : "PAGOS",
        tStatus : "REVISION",
        dRegistered : helper.getDayAndHour()
    }

    try{
        let exist = await ProDocuments.findOne({_tReference : body._tReference})

        if(exist === null){
            proDocuments = new ProDocuments({
                _tReference : body._tReference,
                aDocuments : file
            });
            await proDocuments.save();
        }else{
            await ProDocuments.updateOne({_id : mongoose.Types.ObjectId(exist._id)},
                {$push : {aDocuments : file}})
        }

        let documents = await ProDocuments.find({_tReference : mongoose.Types.ObjectId(body._tReference)},{aDocuments : 1});
        let lastDocument = documents[0].aDocuments[documents[0].aDocuments.length - 1];

        await ProRequests.updateOne({_tReference : mongoose.Types.ObjectId(body._tReference)},{aAttachedTo : lastDocument._id ,tStatus : "REVISION"});
        let requests = await joinRequest({_tReference : mongoose.Types.ObjectId(body._tReference)});
        res.status(200).json({
            msg : `La solicitud se ha mandado a revisión.`,
            requests : requests
        })
    }catch(err){
        console.log(err)
    }
}

exports.completeAndDelete = async (req, res) => {
    const _id = req.body._id
    console.log(_id)
    try{
        let request = await ProRequests.findById({_id : mongoose.Types.ObjectId(_id)});

        await ProDocuments.updateOne({"aDocuments._id" : request.aAttachedTo},
            {$set : {"aDocuments.$.tStatus" : "COMPLETADO"}});

        if(Object.keys(request.aAttachedFrom).length !== 0){
            request.aAttachedFrom.map(async (uri) => {
                await findAndDeleteFile(uri);
            });
        }

        await ProRequests.deleteOne({"_id" : _id});

        request = await joinRequest({_tReference : mongoose.Types.ObjectId(request._tReference)});

        res.status(200).json({
            msg : `La solicitud se ha completado con exito.`,
            requests : request
        }); 

    }catch(err){
        console.log(err)
    }
}

exports.getPayments = async (req, res) => {
    let query = req.query;
    try{

        let payments = await ProDocuments.find({_tReference : mongoose.Types.ObjectId(query._tReference)});

        if(Object.keys(payments).length === 0){
            return res.status(404).json({msg : "No se encontraron datos"});
        }

        payments = payments[0].aDocuments.filter(payment => payment.tStatus === "COMPLETADO" && payment.tTypeDocument === "PAGOS")
        res.status(200).json(payments)
     
    }catch(err){
        res.status(404).json({msg : `El documento no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}

exports.delDocumet = async(req, res) => {
    const ids = req.query;

    try{
        let row = await ProDocuments.aggregate([
            {
              $unwind: "$aDocuments"
            },
            {
              $match: {
                "aDocuments._id": mongoose.Types.ObjectId(ids._idDocument)
              }
            }
        ])

        let uri = row[0].aDocuments.tUri;

        await findAndDeleteFile(uri);

        await ProDocuments.updateOne({_tReference : mongoose.Types.ObjectId(ids._idReference)},
                {$pull : {aDocuments : {_id : mongoose.Types.ObjectId(ids._idDocument)}}});

        let payments = await ProDocuments.find({_tReference : mongoose.Types.ObjectId(ids._idReference)},{aDocuments : 1});

        if(Object.keys(payments).length === 0){
            return res.status(404).json({msg : "No se encontraron datos"});
        }

        payments = payments[0].aDocuments.filter(payment => payment.tStatus === "COMPLETADO" && payment.tTypeDocument === "PAGOS")

        res.status(200).json({
            msg : `El documento ${row[0].aDocuments.tName} se elimino con éxito.`,
            payments : payments
        });      
    }catch(err){
        res.status(404).json({msg : `El documento no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}

const findAndDeleteFile = (uri) => {
    return new Promise((resolve, reject) => {
        fs.stat(uri, (err, stats) => {
            if(err) reject(err);
            fs.unlink(uri, (err) => {
                if (err) reject(err);
                resolve(true);
            })
        })
    })
}

const joinRequest = async (query) => {
    try{
        return await ProRequests.aggregate([
            {
                $lookup: {
                    from: "pro_documents",
                    localField: "_tReference",
                    foreignField: "_tReference",
                    as: "refDocuments"
                }
            },
            {
                $lookup: {
                    from: "pro_users",
                    localField: "_tUserTo",
                    foreignField: "_id",
                    as: "refUserTo",
                }
            },
            {
                $lookup: {
                    from: "pro_users",
                    localField: "_tUserFrom",
                    foreignField: "_id",
                    as: "refUserFrom"
                }
            },
            {
                $lookup: {
                    from: "pro_import_references",
                    localField: "_tReference",
                    foreignField: "_id",
                    as: "refImportReference"
                }
            },
            {$match: query},
            {$sort: { _id : -1 } }
        ]) 

        // return requests.filter(request => {
        //     console.log(request);
            
        //     if(request._aDocuments === undefined){
        //         request.refDocuments = [];
        //         return request;
        //     }else{
        //         let ref =  request.refDocuments.aDocuments.filter(document => {
        //             return JSON.stringify(document._id) === JSON.stringify(request._aDocuments);
        //         })
        //         request.refDocuments = ref;
        //         return requests;
        //     }
        // })
    }catch(err){
        console.log(err)
    }
}