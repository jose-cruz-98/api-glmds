const express = require('express');
const middlewares = require('../utils/middlewares');
const multer = require('multer');
const path = require('path')
const helper = require('../utils/helpers');

/// CONTROLLERS
const references = require('../controllers/references.controllers');
const request = require('../controllers/requests.controller');

// CONFIG
const destPath = './src/files/' + helper.getYear() + "/" + helper.getDateToDay();

multer({dest : destPath});

const storage = multer.diskStorage({
    destination : (req, file, cb) => {
        cb(null, destPath)
    },
    filename : (req, file, cb) => {
        if(req.body.tName !== undefined || req.body.tNote === "" || req.body.tNote !== ""){
            cb(null, `GLMDS-${req.body.tName + "-" + helper.getNewFileName() + path.extname(file.originalname)}`)
        }else{
            cb(null,file.originalname);
        }
    }
})

const upload = multer({storage : storage});

// ROUTES
const router = express.Router();

router.put('/references/reference-import',middlewares.validateToken, references.updImportReference);
router.put('/references/reference-import-state',middlewares.validateToken, upload.single('tFile'), references.updStateImportReference);
router.put('/references/eta', middlewares.validateToken, references.addEta)
router.put('/payments/returned-document',middlewares.validateToken, request.updReturnedDocument);
router.put('/payments/complete-and-delete',middlewares.validateToken, request.completeAndDelete);

module.exports = router;