'use strict'

const { appDbConnection } = require('../db_accessors/db');
const MatchesSchema = require('./Matches');
const UserSchema = require('./User');

const Matches = appDbConnection.model('Matches', MatchesSchema);
const User = appDbConnection.model('User', UserSchema);

module.exports = { Matches, User }
