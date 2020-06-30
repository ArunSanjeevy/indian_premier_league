'use strict'

const express = require('express');
const router = express.Router();
const matches_route_handler = require('../route_handlers/matches_route_handler');
const { auth } = require('../middlewares/aunthenticateRoute');
const { validator } = require('../middlewares/validatePayload');
const Schemas = require('../schemas/index');

router
  .route('/seasons')
  .get(auth, (...args) => matches_route_handler.getSeasonsRoute(...args))

router
  .route('/seasons/:season')
  .get(auth, (...args) => validator(...args, Schemas.getSeasonsSchema), (...args) => matches_route_handler.getMatchesBySeasonsRoute(...args))

router
  .route('/team')
  .get(auth, (...args) => validator(...args, Schemas.getTeamMatchesSchema), (...args) => matches_route_handler.getMatchesByTeamRoute(...args));

router
  .route('/predict')
  .post(auth, (...args) => validator(...args, Schemas.predictMatchSchema), (...args) => matches_route_handler.predictMatchRoute(...args));
 
router
  .route('/:matchId')
  .get(auth, (...args) => validator(...args, Schemas.getMatchesByMatchIdSchema), (...args) => matches_route_handler.getMatchByIdRoute(...args));

module.exports = router;