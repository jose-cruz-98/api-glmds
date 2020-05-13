const express = require('express');
const middlewares = require('../utils/middlewares');
const helper = require('../utils/helpers');
const multer = require('multer');
const path = require('path')
/// CONTROLLERS
const users =  require('../controllers/users.controllers');
const patents = require('../controllers/patents.controllers');
const shippingCompany = require('../controllers/shipping_companies.controllers');
const references = require('../controllers/references.controllers');
const documents = require('../controllers/documents.controllers');
const request = require('../controllers/requests.controller');
const events = require('../controllers/events.controllers');
const carriers = require('../controllers/carrieres.controllers');

// CONFIG
const destPath = './src/files/' + helper.getYear() + "/" + helper.getDateToDay();

multer({dest : destPath});

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, destPath)
    },
    filename : (req, file, cb) => {
        if(req.body.tAmount !== undefined){
            cb(null,file.originalname);
        }else{
            if(req.body.tName !== undefined || req.body.tNote === "" || req.body.tNote !== ""){
                cb(null, `GLMDS-${req.body.tName + "-" + helper.getNewFileName() + path.extname(file.originalname)}`)
            }else{
                cb(null,file.originalname);
            }
        }
    }
})

const upload = multer({storage : storage});

// ROUTES
const router = express.Router();


router.post('/users/singin', users.singin);
router.post('/users/singup', users.singup);
router.post('/patents/patent',middlewares.validateToken, patents.addPatent);
router.post('/shipping-companies/shipping-company',middlewares.validateToken, shippingCompany.addShippingCompany)
router.post('/references/reference-import',middlewares.validateToken, references.addImportReference)
router.post('/documents/document',middlewares.validateToken, upload.single('tFile'), documents.addDocument)
router.post('/documents/note',middlewares.validateToken, documents.addNote)
router.post('/payments/request',middlewares.validateToken, upload.array('tFile', 5), request.addRequest)
router.post('/payments/request-file',middlewares.validateToken, upload.single('tFile'), request.addRequestFile)
router.post('/events/event', middlewares.validateToken, events.addEvent)
router.post('/carriers/carrier', middlewares.validateToken, carriers.addCarrier)
router.post('/carriers/imagen-monitoring',middlewares.validateToken, upload.single('tImagen'), carriers.addImagenMonitoring)

module.exports = router;

// comercial@logisticamaresdelsur.com
// Guadalajara1!