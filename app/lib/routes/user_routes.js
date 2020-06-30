'use strict'

const express = require('express');
const router = express.Router();
const user_route_handler = require('../route_handlers/user_route_handler');
const { auth } = require('../middlewares/aunthenticateRoute');
const { validator } = require('../middlewares/validatePayload');
const Schemas = require('../schemas/index');

router
  .route('/signup')
  .post((...args) => validator(...args, Schemas.userSignupSchema), (...args) => user_route_handler.userSignUpRoute(...args))

router
  .route('/login')
  .post((...args) => validator(...args, Schemas.loginSchema), (...args) => user_route_handler.userLoginRoute(...args))

router
  .route('/logout')
  .post(auth, (...args) => user_route_handler.userLogoutRoute(...args))

module.exports = router;