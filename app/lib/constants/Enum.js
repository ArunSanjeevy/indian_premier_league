'use strict'

const { team_name, city, toss_decision} = require('./Constants');

const teams = Object.values(team_name);
const cities = Object.values(city);
const toss_decisions = Object.values(toss_decision);

module.exports = { cities, teams, toss_decisions }