'use-strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/post-controller');
const authService = require('../service/auth-service');

router.post('/', authService.authorize, controller.post);

router.post('/getPostLessThanOrEqual', authService.authorize, controller.getPostLessThanOrEqual);

module.exports = router;
