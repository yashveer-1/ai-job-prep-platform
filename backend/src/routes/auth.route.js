const express = require('express');
const AuthRouter = express.Router();
const AuthController = require('../controllers/auth.controller');
const authUser = require('../middlewares/auth.middleware');

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 */

AuthRouter.post('/register', AuthController.registerUserController);


/**
 * @route POST /api/auth/login
 * @desc Login a user
 * @access Public
 */
AuthRouter.post('/login', AuthController.loginUserController);

/**
 * @route POST /api/auth/logout
 * @desc Logout a user
 * @access Public
 */
AuthRouter.post('/logout', AuthController.logoutUserController);

/** 
 * @route GET/api/auth/get-me
 * @description get the current user
 * @access Private
 */
AuthRouter.get('/get-me', authUser, AuthController.getMeController);



module.exports = AuthRouter;