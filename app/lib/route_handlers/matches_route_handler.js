'use strict'

const MatchesController = require('../controllers/matches_controller');
const BaseHelper = require('../helpers/base');
const scope = "MatchesRouteHandler";

class MatchesRouteHandler extends BaseHelper{
  constructor() {
    super();
    this.matchesController = new MatchesController();
  }

  // Each method is a handler function for each route accepting the http request, response parameters
  
  async getSeasonsRoute(request, response, next) {
    try {
      this.logInfo(scope, "getSeasonsRoute", { http_method:request.method, request_url: request.originalUrl});
      let seasons = await this.matchesController.fetchSeasons();
      response.status(200).json(seasons);
    } catch(error) {
      this.logError(scope, "getSeasonsRoute", error);
      next(error);
    }
  }

  async getMatchesBySeasonsRoute(request, response, next) {
    try {
      this.logInfo(scope, "getMatchesBySeasonsRoute", { http_method:request.method, request_url: request.originalUrl});
      let season_matches = await this.matchesController.fetchSeasonMatches(request.params.season);
      response.status(200).json(season_matches);
    } catch(error) {
      this.logError(scope, "getMatchesBySeasonsRoute", error);
      next(error);
    }
  }

  async getMatchesByTeamRoute(request, response, next) {
    try {
      this.logInfo(scope, "getMatchesByTeamRoute", { http_method:request.method, request_url: request.originalUrl});
      let team_matches = await this.matchesController.fetchTeamMatches(request.query.team_name);
      response.status(200).json(team_matches);
    } catch(error) {
      this.logError(scope, "getMatchesByTeamRoute", error);
      next(error);
    }
  }

  async getMatchByIdRoute(request, response, next) {
    try {
      this.logInfo(scope, "getMatchByIdRoute", { http_method:request.method, request_url: request.originalUrl});
      let match = await this.matchesController.fetchMatchData(request.params.matchId);
      response.status(200).json(match);
    } catch(error) {
      this.logError(scope, "getMatchByIdRoute", error);
      next(error);
    }
  }

  async predictMatchRoute(request, response, next) {
    try {
      this.logInfo(scope, "predictMatchRoute", { http_method:request.method, request_url: request.originalUrl});
      let result = await this.matchesController.predictMatch(request.body);
      response.status(200).json(result);
    } catch(error) {
      this.logError(scope, "predictMatchRoute", error);
      next(error);
    }
  }
}

module.exports = new MatchesRouteHandler();