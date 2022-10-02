const express = require('express');
const router = express.Router();

const accountController = require('../controller/auth.controller');

router.route('/register').post(accountController.register);
router.route('/login').post(accountController.login);

module.exports = router;