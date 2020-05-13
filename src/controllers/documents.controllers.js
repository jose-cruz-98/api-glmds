const ProDocuments = require('../models/pro_documents.models');
const mongoose = require('mongoose')
const helper = require('../utils/helpers');
const path = require('path')
const fs = require('fs')

exports.addDocument = async (req, res, next) => {
    const body = req.body;
    var proDocuments;

    let documents = {
        tName : body.tName,
        tUri : req.file.destination + "/" + req.file.filename,
        tOperation : body.tOperation,
        tTypeDocument : body.tTypeDocument,
        tStatus : body.tStatus,
        dRegistered : helper.getDayAndHour()
    }


    try{
        let exist = await ProDocuments.findOne({_tReference : body._tReference});
        if(exist === null){
            let data = {
                _tReference : body._tReference,
                aDocuments : documents
            }

            proDocuments = new ProDocuments(data);
            await proDocuments.save();
        }else{
            await ProDocuments.updateOne({_id : exist._id},
                {$push : {aDocuments : documents}});
        }
            
        documents = await ProDocuments.find({_tReference : body._tReference},{aDocuments : 1});
        documents[0].aDocuments = documents[0].aDocuments.filter(document => document.tTypeDocument === body.tTypeDocument);

        res.status(200).json({
            msg : `El documento ${body.tName} se guardo con éxito.`,
            documents : documents
        });
    }catch(err){
        console.log("Error in : ", err);
    }
}

exports.getDocument = async(req, res, next) => {
    const query = req.query;

    try{
        let documents = "";
        if(query._tReference){
            documents = await ProDocuments.find({_tReference : query._tReference},{aDocuments : 1});
        }else{
            documents = await ProDocuments.find({},{aDocuments : 1});
        }

        if(Object.keys(documents).length === 0){
           return res.status(404).json({msg : "No se encontraron datos"});
        }

        if(query.tTypeDocument) documents[0].aDocuments = documents[0].aDocuments.filter(document => document.tTypeDocument === query.tTypeDocument);
        
        return res.status(200).json({documents});
        
    }catch(err){
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

        let documents = await ProDocuments.find({_tReference : mongoose.Types.ObjectId(ids._idReference)},{aDocuments : 1});
        documents[0].aDocuments = documents[0].aDocuments.filter(document => document.tTypeDocument === row[0].aDocuments.tTypeDocument);
        
        res.status(200).json({
            msg : `El documento ${row[0].aDocuments.tName} se elimino con éxito.`,
            documents : documents
        });      
    }catch(err){
        res.status(404).json({msg : `El documento no se pudo  eliminar.`});
        console.log("Error in : ", err)
    }
}

exports.files = async(req, res) => {
    try{
        let row = await ProDocuments.aggregate([
            {
              $unwind: "$aDocuments"
            },
            {
              $match: {
                "aDocuments._id": mongoose.Types.ObjectId(req.params.uri)
              }
            }
          ])
          let link = row[0].aDocuments.tUri.replace('./','../../')
          res.sendFile(path.join(__dirname, link));
    }catch(err){
        console.log(err)
    }
}

exports.filesAttached = async(req, res) => {
    let {year,day,namefile} = req.params;
    try{
          let link = `../../src/files/${year}/${day}/${namefile}`;
          res.sendFile(path.join(__dirname, link));
    }catch(err){
        console.log(err)
    }
}

exports.addNote = async(req, res) => {
    tTypeDocument = req.body.tTypeDocument;
    delete req.body["tTypeDocument"]
    try{
        await ProDocuments.updateOne({"aDocuments._id" : req.body._aDocuments},
            {$push : {"aDocuments.$.tNote" : req.body.tNote}});

        let documents = await ProDocuments.find({_tReference : mongoose.Types.ObjectId(req.body._tReference)},{aDocuments : 1});
        documents[0].aDocuments = documents[0].aDocuments.filter(document => document.tTypeDocument === tTypeDocument);
        
        res.status(200).json({
            msg : "La nota se agrego con exito.",
            documents : documents
        }); 
    }catch(err){
        console.log(err)
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
