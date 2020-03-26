const express = require('express');
/// CONTROLLERS
const users =  require('../controllers/users.controllers');
const patents = require('../controllers/patents.controllers');

// ROUTES
const router = express.Router();

router.post('/users/singin', users.singin);
router.post('/users/singup', users.singup);
router.post('/patents/patent', patents.addPatent);

module.exports = router;

// comercial@logisticamaresdelsur.com
// Guadalajara1!