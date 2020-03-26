const express = require('express');
const middlewares = require('../utils/middlewares');
/// CONTROLLERS
const patents = require('../controllers/patents.controllers');

// ROUTES
const router = express.Router();

router.get('/patents/patent', middlewares.validateToken ,patents.getPatent);

module.exports = router;