'use strict'

const Joi = require('@hapi/joi');
const Enum = require('../constants/Enum');


const team_name =  Joi.string().required().valid(...Enum.teams);
const matchId =  Joi.string().required();
const season = Joi.string().min(4).max(4).required();
const username = Joi.string().min(6).max(16).required();
const password = Joi.string().min(6).max(16).required();

//Schema for matches route

const getSeasonMatchesParams = Joi.object().keys({
  season
});

const getTeamMatchesQuery = Joi.object().keys({
  team_name
});

const getMatchesByMatchIdParams = Joi.object().keys({
  matchId
});

const getSeasonsSchema = {
  params: getSeasonMatchesParams
}

const getTeamMatchesSchema = {
  query: getTeamMatchesQuery
}

const getMatchesByMatchIdSchema = {
  params: getMatchesByMatchIdParams
}

const predictMatchBody = Joi.object().keys({
  "team1": team_name,
  "team2": team_name,
  "team_to_bat_first": team_name,
  "venue": Joi.string().required()
});

const predictMatchSchema = {
  body: predictMatchBody
}

//Schema for User routes
const userSignupBody = Joi.object().keys(
  { 
    username,
    password,
    "email": Joi.string().email().required().messages({
      "string.email": `"email" should be a valid email`,
      "string.empty": `"email" cannot be an empty field`,
      "any.required": `"email" is a required field`
    }),
    "first_name": Joi.string().min(3).max(16).required(),
    "last_name":Joi.string().min(3).max(16).required(),
    "favourite_team": team_name
  }
);

const loginBody = Joi.object().keys({
  username,
  password
});

const userSignupSchema = {
  body: userSignupBody
}

const loginSchema = {
  body: loginBody
}

const MatchSchema = Joi.object().keys({
  id: matchId,
  season: season,
  date: Joi.date().required(),
  city: Joi.string().valid(...Enum.cities).required(),
  team1: team_name,
  team2: team_name,
  toss_winner: team_name,
  toss_decision: Joi.string().valid(...Enum.toss_decisions).required(),
  result: Joi.string().required(),
  dl_applied: Joi.string().required(),
  winner: Joi.string().valid(...Enum.teams).allow('', null),
  win_by_runs: Joi.string(),
  win_by_wickets: Joi.string(),
  player_of_match: Joi.string().allow('', null),
  venue: Joi.string(),
  umpire1: Joi.string().allow('', null),
  umpire2: Joi.string().allow('', null),
  umpire3: Joi.string().allow('', null)
});

module.exports = {
  predictMatchSchema,
  getSeasonsSchema,
  getTeamMatchesSchema,    
  getMatchesByMatchIdSchema,
  userSignupSchema,
  loginSchema,
  MatchSchema
}



