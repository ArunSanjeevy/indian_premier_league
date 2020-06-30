'use strict'

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { teams } = require('../constants/Enum');

const UserSchema = new Schema({
  user_id: {
    type: String,
    required: true
  },
  username: {
    type: String,
    unique: true,
    required: true
  },
  hash: {
    type: String,
    required: true
  },
  first_name: {
    type: String,
    required: true
  },
  last_name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    unique: true,
    required: true
  },
  favourite_team: {
    type: String,
    required: true,
    enum: teams
  },
  login_attempts: {
    type: Number,
    default: 0
  },
  last_logged_in:{
    type: Date
  },
  last_log_in_attempt:{
    type: Date
  }
},
{
  collection: "users",
  timestamps: true
});


module.exports = UserSchema;