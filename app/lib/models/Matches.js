'use strict'

const mongoose = require('mongoose');
const { Schema } = mongoose;

const MatchesSchema = new Schema({
  id:{ type: Number, required: true, unique: true },
  season: { type: Number, required: true },
  city: { type: String, required: false },
  date: { type: Date, required: true },
  team1: { type: String, required: true },
  team2: { type: String, required: true },
  toss_winner: { type: String, required: true },
  toss_decision:  { type: String, required: true },
  result: { type: String, required: true },
  dl_applied: { type: Number, required: false},
  winner: { type: String, required: false},
  win_by_runs: { type: Number, required: true },
  win_by_wickets: { type: Number, required: true },
  player_of_match: { type: String, required: false},  
  umpire1: { type: String, required: false}, 
  umpire2: { type: String, required: false}, 
  umpire3: { type: String, required: false}
},
{
  collection: "matches",
  timestamps: true
});


module.exports = MatchesSchema;