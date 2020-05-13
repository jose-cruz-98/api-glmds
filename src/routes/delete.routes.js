const express = require('express');
const middlewares = require('../utils/middlewares');
/// CONTROLLERS
const documents = require('../controllers/documents.controllers');
const request = require('../controllers/requests.controller');

// ROUTES
const router = express.Router();

router.delete('/documents/document', middlewares.validateToken, documents.delDocumet);
router.delete('/payments/request', middlewares.validateToken, request.delRequest);
router.delete('/payments/payment', middlewares.validateToken, request.delDocumet);
module.exports = router;