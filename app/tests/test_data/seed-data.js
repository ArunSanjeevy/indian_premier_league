'use strict'

const MatchesDBAccessor = require('../../lib/db_accessors/matches_db_accessor');
const UserDBAccessor = require('../../lib/db_accessors/user_db_accessor');
const matches_data = require('./matches_data.json');
const user_data = require('./user_data.json');
const uuid = require('uuid');
const requestContext = {};
requestContext.req_id = uuid.v4();

const setupDB = async() => {
  const userDBAccessor = new UserDBAccessor(requestContext);
  const matchesDBAccessor = new MatchesDBAccessor(requestContext);
  await userDBAccessor._deleteUsers();
  await userDBAccessor._insertUsers(user_data);
  await matchesDBAccessor._deleteMatches();
  await matchesDBAccessor._insertMatches(matches_data);
}

module.exports = setupDB ;