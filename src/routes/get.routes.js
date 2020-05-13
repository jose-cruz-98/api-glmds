const express = require('express');
const middlewares = require('../utils/middlewares');
/// CONTROLLERS
const users= require('../controllers/users.controllers');
const patents = require('../controllers/patents.controllers');
const shippingCompany = require('../controllers/shipping_companies.controllers');
const references = require('../controllers/references.controllers');
const documents = require('../controllers/documents.controllers');
const request = require('../controllers/requests.controller');
const events = require('../controllers/events.controllers');
const carriers = require('../controllers/carrieres.controllers');
const evidences = require('../controllers/evidences.controller')

// ROUTES
const router = express.Router();

router.get('/patents/patent', middlewares.validateToken ,patents.getPatent);
router.get('/shipping-companies/shipping-company', middlewares.validateToken, shippingCompany.getShippingComapny);
router.get('/references/reference-import',middlewares.validateToken , references.getImportReference);
router.get('/documents/document',middlewares.validateToken, documents.getDocument);
router.get('/documents/:uri',documents.files);
router.get('/documents/attached/:year/:day/:namefile',documents.filesAttached);
router.get('/users/user-by-role', users.getUserByRole);
router.get('/payments/request',middlewares.validateToken, request.getRequest)
router.get('/payments/payment',middlewares.validateToken, request.getPayments)
router.get('/events/event', middlewares.validateToken, events.getEvents)
router.get('/carriers/carrier', middlewares.validateToken, carriers.getCarriers)
router.get('/evidences/evidence',middlewares.validateToken, evidences.getEvidence)
module.exports = router;