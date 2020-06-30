'use strict'

const test = require('ava');
const MatchesController = require('../../../lib/controllers/matches_controller');
const MatchesDBAccessor = require('../../../lib/db_accessors/matches_db_accessor');
const matches_data = require('../../test_data/matches_data.json');
const Constants = require('../../../lib/constants/Constants');
const Errors = require('../../../lib/constants/Errors');
const matchesDBAccessor = new MatchesDBAccessor();
const matchesController = new MatchesController();

test.before(async () => {
  await matchesDBAccessor._deleteMatches();
  await matchesDBAccessor._insertMatches(matches_data);
});

test.after.always(async () => {
  await matchesDBAccessor._deleteMatches();
});

test("fetchSeasons() -> Should fetch a unique list of seasons", async (t) => {
  let seasons = [2008, 2017];
  let result = await matchesController.fetchSeasons();
  t.deepEqual(result, seasons);
});

test("fetchSeasonMatches() -> Should fetch matches only from the season that is passed", async (t) => {
  let season = 2017;
  let result = await matchesController.fetchSeasonMatches(season);
  t.is(result[1].season, season);
});

test("fetchSeasonMatches() -> Should throw matches_not_found_for_season error for off season or invalid season", async (t) => {
  try {
    await matchesController.fetchSeasonMatches(2025);
  } catch (error) {
    t.is(error, Errors.matches_not_found_for_season);
  }
});

test("fetchMatchData() -> Should fetch match of the match_id passed", async (t) => {
  let match_id = 56;
  let result = await matchesController.fetchMatchData(match_id);
  t.is(result.id, match_id);
});

test("fetchMatchData() -> Should throw matches_not_found_for_id error for invalid id", async (t) => {
  try {
    await matchesController.fetchMatchData(100045);
  } catch(error) {
    t.is(error, Errors.matches_not_found_for_id);
  }
});

test("fetchTeamMatches() -> Should fetch matches only of the team that is passed", async (t) => {
  let team_name = Constants.team_name.mumbai_indians;
  let result = await matchesController.fetchTeamMatches(team_name);
  t.is(result[1].team2, team_name);
});

test("fetchTeamMatches() -> Should throw matches_not_found_for_team for invalid/non existant team name", async (t) => {
  try {
    await matchesController.fetchTeamMatches("India mumbai");
  } catch(error) {
    t.is(error, Errors.matches_not_found_for_team);
  }
});

//dynamic
test("fetchLastFiveMatchPerformance() -> Should return last five matches performance of the team passed", async (t) => {
  let result = await matchesController.fetchLastFiveMatchPerformance(Constants.team_name.mumbai_indians);
  t.is(result, 60);
});

test("fetchLastFiveMatchPerformance() -> Should throw invalid_team_name error for invalid team", async (t) => {
  try {
    await matchesController.fetchLastFiveMatchPerformance("India mumbai");
  } catch(error) {
    t.is(error, Errors.invalid_team_name);
  }
});

test("fetchChasingAndDefendingPerformance() -> Should throw invalid_team_name error for invalid team", async (t) => {
  try {
    await matchesController.fetchChasingAndDefendingPerformance("India mumbai");
  } catch(error) {
    t.is(error, Errors.invalid_team_name);
  }
});

test("fetchHeadOnPerformance() -> Should throw invalid_team_name error for invalid team", async (t) => {
  try {
    await matchesController.fetchHeadOnPerformance("India mumbai", Constants.team_name.chennai_super_kings);
  } catch(error) {
    t.is(error, Errors.invalid_team_name);
  }
});