'use strict'

const MatchesDBAccessor = require('../db_accessors/matches_db_accessor');
const _ = require('lodash');
const Enum = require('../constants/Enum');
const Errors = require('../constants/Errors');
const Constants =  require('../constants/Constants');
const BaseHelper = require('../helpers/base');
const scope = "MatchesController";


class MatchesController extends BaseHelper {
  constructor() {
    super();
    this.matchesDBAccessor = new MatchesDBAccessor();
  }

  /**
 * @method Validates the passed team name against the enum
 * @author Arun Sanjeevy
 * @param {string} team - The team name to be validated
 * @return {void} Nothing 
 */

  validateTeamName(team) {
    this.logMessage(scope, "validateTeamName", "Validating the team name");
    if(_.includes(Enum.teams, team)) {
      this.logMessage(scope, "validateTeamName", "Validation successful");
      return;
    } else {
      this.logMessage(scope, "validateTeamName", "Validation failed");
      throw Errors.invalid_team_name;
    }
  }

  /**
 * @method Fetches a list of unique seasons from the available matches
 * @author Arun Sanjeevy
 * @param {void} - Nothing
 * @return {Array} - Unique list of seasons 
 */

  async fetchSeasons() {
    try {
      this.logMessage(scope, "fetchSeasons", "Fetching data");
      let seasons = await this.matchesDBAccessor.getMatchSeasons();
      this.logMessage(scope, "fetchSeasons", "Fetched successfully");
      this.logInfo(scope, "fetchSeasons", seasons);
      return seasons;
    } catch(error) {
      this.logError(scope, "fetchSeasons", error);
      throw error;
    }
  }

  /**
 * @method Fetches list of matches for a season
 * @author Arun Sanjeevy
 * @param {string} season - the season year eg: 2017
 * @return {Array} - list of matches played for the specified season 
 */

  async fetchSeasonMatches(season) {
    try {
      this.logMessage(scope, "fetchSeasonMatches", "Fetching data");
      let matches = await this.matchesDBAccessor.getMatches({season});
      this.logMessage(scope, "fetchSeasons", "Fetched successfully");
      if(matches.length > 0) {
        return matches;
      } else {
        throw Errors.matches_not_found_for_season;
      }
    } catch(error) {
      this.logError(scope, "fetchSeasonMatches", error);
      throw error;
    }
  }

  /**
 * @method Fetches a match data for a match id
 * @author Arun Sanjeevy
 * @param {string} match_id - the match id
 * @return {object} - the match of the match_id 
 */

  async fetchMatchData(match_id) {
    try {
      this.logMessage(scope, "fetchMatchData", "Fetching data");
      let match = await this.matchesDBAccessor.getMatch({id: match_id});
      if(match) {
        this.logMessage(scope, "fetchMatchData", "Fetched successfully");
        return match;
      } else {
        this.logMessage(scope, "fetchMatchData", `No match found for ${match_id}`);
        throw Errors.matches_not_found_for_id;
      }
    } catch(error) {
      this.logError(scope, "fetchMatchData", error);
      throw error;
    }
  }

  /**
 * @method Fetches the list of matches of a team
 * @author Arun Sanjeevy
 * @param {string} team_name - the team name
 * @return {array} - the list of matches played by the team 
 */

  async fetchTeamMatches(team_name) {
    try {
      this.logMessage(scope, "fetchTeamMatches", `Fetching data for ${team_name}`);
      let matches = await this.matchesDBAccessor.getMatches({ $or: [{team1: team_name}, {team2: team_name}]});
      if(matches.length > 0) {
        this.logMessage(scope, "fetchTeamMatches", "Fetched successfully");
        return matches;
      } else {
        this.logMessage(scope, "fetchTeamMatches", `No matches found ${team_name}`);
        throw Errors.matches_not_found_for_team;
      }
    } catch(error) {
      this.logError(scope, "fetchTeamMatches", error);
      throw error;
    }
  }

  /**
 * @method Calcualtes the win percentage of team1 vs team2
 * @author Arun Sanjeevy
 * @param {object} data - the team1, team2, team_to_bat_first and venue
 * @return {object} - the win percentage of each team 
 */

  async predictMatch({team1, team2, team_to_bat_frist, venue}) {
    try {  
      this.logMessage(scope, "predictMatch", `Computing data`);  
      this.logInfo(scope, "predictMatch", {team1, team2, team_to_bat_frist, venue});
      let { team1_head_on_performance, team2_head_on_performance, team1_home_away_performance, team2_home_away_performance} = await this.fetchHeadOnPerformance(team1, team2);    
      let team1_last_five_matches_performance = await this.fetchLastFiveMatchPerformance(team1);  
      let team2_last_five_matches_performance = await this.fetchLastFiveMatchPerformance(team2);
      let team1_CD_stats = await this.fetchChasingAndDefendingPerformance(team1);
      let team2_CD_stats = await this.fetchChasingAndDefendingPerformance(team2);
      let team1_win_percentage = _.round((team1_head_on_performance + team1_home_away_performance + team1_last_five_matches_performance + (team_to_bat_frist == team1 ? team1_CD_stats.defending_performance: team1_CD_stats.chasing_performance)) / 5, 2);
      let team2_win_percentage = _.round((team2_head_on_performance + team2_home_away_performance + team2_last_five_matches_performance + (team_to_bat_frist == team2 ? team2_CD_stats.defending_performance: team2_CD_stats.chasing_performance)) / 5, 2);
      this.logMessage(scope, "predictMatch", `Compute successful`);
      this.logInfo(scope, "predictMatch", {team1_win_percentage, team2_win_percentage});
      return {team1_win_percentage, team2_win_percentage};
    } catch(error) {
      this.logError(scope, "predictMatch", error);
      throw error;
    }
  }

  /**
 * @method Calculates the last five match performace percentage of team
 * @author Arun Sanjeevy
 * @param {string} team - the team name
 * @return {object} - the last five match performace percentage of team 
 */

  async fetchLastFiveMatchPerformance(team) {
    try {
      this.validateTeamName(team);
      this.logMessage(scope, "fetchLastFiveMatchPerformance", `Computing data for ${team}`);
      let query = [
        {
          $match: { 
            $or: [ {team1: team}, { team2: team} ]
          }
        },
        {
          $sort: {
            date: -1
          }
        },
        {
          $limit: 5
        },
        {
          $match: { winner: team}
        }
      ]
      let matches = await this.matchesDBAccessor.getMatchesAggregation(query);  
      let last_five_matches_performance = (matches.length * 100) / 5;
      this.logMessage(scope, "fetchLastFiveMatchPerformance", `Computation successful for ${team}`);
      this.logInfo(scope, "fetchLastFiveMatchPerformance", last_five_matches_performance);
      return last_five_matches_performance;
    } catch(error) {
      this.logError(scope, "fetchLastFiveMatchPerformance", error);
      throw error;
    }
  }

  /**
 * @method Calculates the chasing and defending performace of team
 * @author Arun Sanjeevy
 * @param {string} team - the team name
 * @return {object} - the chasing and defending performace percentage of team 
 */

  async fetchChasingAndDefendingPerformance(team) {
    try {
      this.validateTeamName(team);
      this.logMessage(scope, "fetchChasingAndDefendingPerformance", `Computing data for ${team}`);
      let team_matches = await this.fetchTeamMatches(team);
      let won_by_chasing = 0;
      let lost_by_chasing = 0;
      let won_by_defending = 0;
      let lost_by_defending = 0;
      _.forEach(team_matches, (match) => {
        if(match.toss_winner === team) {
          if(match.toss_decision === Constants.toss_decision.field) {
            if(match.winner === team) {
              won_by_chasing+=1;
            } else {
              lost_by_chasing+=1;
            }
          } else if (match.toss_decision === Constants.toss_decision.bat) {
            if(match.winner === team) {
              won_by_defending+=1;
            } else {
              lost_by_defending+=1;
            }
          }
        } else {
          if(match.toss_decision === Constants.toss_decision.field) {
            if(match.winner === team) {
              won_by_defending+=1;
            } else {
              lost_by_defending+=1;
            }
          } else if (match.toss_decision === Constants.toss_decision.bat) {
            if(match.winner === team) {
              won_by_chasing+=1;
            } else {
              lost_by_chasing+=1;
            }
          }
        }
      } );
      let chasing_performance = (won_by_chasing * 100) / (won_by_chasing + lost_by_chasing);
      let defending_performance = (won_by_defending * 100) / (won_by_defending + lost_by_defending);
      this.logMessage(scope, "fetchChasingAndDefendingPerformance", `Computation successful ${team}`);
      this.logInfo(scope, "fetchChasingAndDefendingPerformance", { chasing_performance, defending_performance});
      return { chasing_performance, defending_performance};
    } catch(error) {
      this.logError(scope, "fetchChasingAndDefendingPerformance", error);
      throw error;
    }
  }

  /**
 * @method Calculates the head on performace of team1 vs team2
 * @author Arun Sanjeevy
 * @param {string} team1 - the team1 name
 * @param {string} team2 - the team2 name
 * @return {object} - the the head on performace of team1 vs team2 
 */

  async fetchHeadOnPerformance(team1, team2) {
    try {
      this.validateTeamName(team1);
      this.validateTeamName(team2);
      this.logMessage(scope, "fetchHeadOnPerformance", `Computing data for ${team1} ${team2}`);
      let team1_wins = 0; 
      let team2_wins = 0;
      let team1_home_away_wins = 0;
      let team2_home_away_wins = 0;
      let team1_key = _.invert(Constants.team_name)[team1];
      let team2_key = _.invert(Constants.team_name)[team2];
      let query_1 = [
        {
          $match:{ 
            $or: [ {team1: team1, team2: team2}, {team1: team2, team2: team1} ]
          }
        },
        { $group : { 
          _id :{
            team: "$winner",
            city: "$city"
          },
          wins: { $sum: 1 }
        } 
        }
      ];
      let head_on_stats = await this.matchesDBAccessor.getMatchesAggregation(query_1);
      _.forEach (head_on_stats, (stat) => {
        if(stat._id.team === team1) {
          team1_wins += stat.wins;
          if(stat._id.city !== Constants.team_city[team1_key]) {
            team1_home_away_wins += stat.wins
          }
        } else if(stat._id.team === team2) {
          team2_wins += stat.wins;
          if(stat._id.city !== Constants.team_city[team2_key]) {
            team2_home_away_wins += stat.wins
          }
        }
      }
      );
      let total_head_on_matches = team1_wins + team2_wins;
      let total_head_on_home_away_matches = team1_home_away_wins + team2_home_away_wins;
      let team1_head_on_performance = (team1_wins * 100 ) / total_head_on_matches;
      let team2_head_on_performance = (team2_wins * 100 ) / total_head_on_matches;
      let team1_home_away_performance = (team1_home_away_wins * 100) / total_head_on_home_away_matches;
      let team2_home_away_performance = (team1_home_away_wins * 100) / total_head_on_home_away_matches;
      this.logMessage(scope, "fetchHeadOnPerformance", `Computation successful`);
      this.logInfo(scope, "fetchHeadOnPerformance", { team1_head_on_performance, team2_head_on_performance, team1_home_away_performance, team2_home_away_performance});
      return { team1_head_on_performance, team2_head_on_performance, team1_home_away_performance, team2_home_away_performance}
    } catch(error) {
      this.logError(scope, "fetchHeadOnPerformance", error);
      throw error;
    }
  }
}

module.exports = MatchesController;