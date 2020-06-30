'use strict'

const { Matches } = require('../models/index');
const BaseHelper = require('../helpers/base');
const scope = "MatchesDBAccessor";

class MatchesDBAccessor extends BaseHelper{
  constructor() {
    super();
  }

  /**
 * @method Executes the passed query and returns one result
 * @author Arun Sanjeevy
 * @param {object} query - the query to be executed in Matches collection
 * @return {object} - returns the match data 
 */

  async getMatch(query) {
    try {
      this.logMessage(scope, "getMatch", "Executing query");
      this.logInfo(scope, "getMatch", query);
      return await Matches.findOne(query);
    } catch(error) {
      this.logError(scope, "getMatch", error);
      throw error;
    }
  }

  /**
 * @method Fetches a list of unique seasons
 * @author Arun Sanjeevy
 * @param {void} - Nothing
 * @return {array} - returns an array of unique seasons
 */

  async getMatchSeasons() {
    try {
      this.logMessage(scope, "getMatchSeasons", "Executing query");
      return await Matches.distinct("season");
    } catch(error) {
      this.logError(scope, "getMatchSeasons", error);
      throw error;
    }
  }

  /**
 * @method Executes the query and returns a list of matches
 * @author Arun Sanjeevy
 * @param {object} query - query to be executed
 * @return {array} - returns an array match data objects
 */

  async getMatches(query) {
    try {
      this.logMessage(scope, "getMatches", "Executing query");
      this.logInfo(scope, "getMatches", query);
      return await Matches.find(query);
    } catch(error) {
      this.logMessage(scope, "getMatches", error);
      throw error;
    }
  }

  /**
 * @method Executes the aggregationi query and returns the result
 * @author Arun Sanjeevy
 * @param {object} query - query to be executed
 * @return {object} - returns the result of the aggregation
 */

  async getMatchesAggregation(query) {
    try {
      this.logMessage(scope, "getMatchesAggregation", "Executing query..");
      this.logInfo(scope, "getMatchesAggregation", query);
      return await Matches.aggregate(query);
    } catch(error) {
      this.logError(scope, "getMatchesAggregation", error);
      throw error;
    }
  }

  /**
 * @method inserts an array of matches
 * @author Arun Sanjeevy
 * @access Private-Only for internal use
 * @param {object} matches - matches to be inserted into the db
 * @return {void} - Nothing
 * @todo Need to validate the matches arrya before inserting into the db
 */

  async _insertMatches(matches) {
    try {
      await Matches.insertMany(matches);
    } catch(error) {
      this.logError(scope, "_insertMatches", error);
      throw error;
    }
  }

  /**
 * @method deletes all matches
 * @author Arun Sanjeevy
 * @access Private-Only for internal use
 * @param {void} - Nothing
 * @return {void} - Nothing
 */

  async _deleteMatches() {
    try {
      await Matches.deleteMany({});
    } catch(error) {
      this.logError(scope, "_deleteMatches", error);
      throw error;
    }
  }
}


module.exports = MatchesDBAccessor;