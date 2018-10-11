'use-strict'

const express = require('express');
const router = express.Router();
const controller = require('../controllers/user-controller');
const authService = require('../service/auth-service');

//GET
router.get('/', authService.authorize, controller.get);

//GET by username
router.get('/:username', authService.authorize, controller.getByUsername);

//POST
router.post('/', controller.post);

//authenticate
router.post('/authenticate', controller.authenticate);

//refreshToken
router.get('/refresh-token', authService.authorize, controller.refreshToken);

//DELETE
router.delete('/', authService.authorize, controller.delete);

//PUT
router.put('/', authService.authorize, controller.update);

//POST
router.post('/follow', authService.authorize, controller.follow);

//POST
router.post('/unfollow', authService.authorize, controller.unfollow)

module.exports = router;
