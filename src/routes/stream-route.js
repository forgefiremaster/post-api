'use-strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/stream-controller');
const authService = require('../service/auth-service');

router.post('/info', authService.authorize, controller.getById);

router.post('/', authService.authorize, controller.post)

module.exports = router;
