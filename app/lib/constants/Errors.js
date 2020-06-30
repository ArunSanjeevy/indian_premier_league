'use strict'

module.exports = {
  user_already_exists: {
    error_code: "user_already_exists",
    error_message: "Sorry the user already exists",
    status_code: 409
  },
  user_authentication_failed: {
    error_code: "user_authentication_failed",
    error_message: "Sorry invalid username/password",
    status_code: 401
  },
  user_exceeded_login_attempts: {
    error_code: "user_exceeded_login_attempts",
    error_message: "Sorry number of failed login attempts exceeded, please try again after an hour",
    status_code: 401
  },
  matches_not_found_for_season: {
    error_code: "matches_not_found_for_season",
    error_message: "Sorry no matches found for the specified season",
    status_code: 404
  },
  matches_not_found_for_id: {
    error_code: "matches_not_found_for_id",
    error_message: "Sorry no match found for the specified id",
    status_code: 404
  },
  matches_not_found_for_team: {
    error_code: "matches_not_found_for_team",
    error_message: "Sorry no match found for the specified team",
    status_code: 404
  },
  invalid_team_name: {
    error_code: "invalid_team_name",
    error_message: "Sorry the specified team_name is invalid",
    status_code: 409
  }
}