'use strict'

const uuid = require('uuid');
const bcrypt = require('bcryptjs');

const UserDBAccessor = require('../db_accessors/user_db_accessor');
const config = require(`../../config/${process.env.NODE_ENV}-config.json`);
const BaseHelper = require('../helpers/base');
const Errors = require('../constants/Errors');
const scope = "UserController"

class UserController extends BaseHelper{
  constructor() {
    super();
    this.userDBAccessor = new UserDBAccessor();
  }

  /**
 * @method Creates a new user
 * @author Arun Sanjeevy
 * @param {object} user_data - the user data to create the user
 * @return {void} Nothing 
 */

  async createUser(user_data) {
    try {
      // check if the user exists already
      this.logMessage(scope, "createUser", "Checking if the user exists already");
      let existing_user = await this.userDBAccessor.fetchUserByUsername(user_data.username);
      if(existing_user) {
        this.logMessage(scope, "createUser", `${existing_user.username} exists already`);
        throw Errors.user_already_exists;
      }  
      user_data.user_id = uuid.v4();
      user_data.hash = bcrypt.hashSync(user_data.password, 10);
      await this.userDBAccessor.insertUser(user_data);
      this.logMessage(scope, "createUser", `${user_data.username} created successfully`);
      return;
    } catch(error) {
      this.logError(scope, "createUser", error);
      throw error;
    }
  }

  /**
 * @method Authenticates the user with the passed credentials
 * @author Arun Sanjeevy
 * @param {object} data - the username and password
 * @return {object} userdata 
 */
  async authenticateUser({ username, password }) {
    try {
      this.logMessage(scope, "authenticateUser", `Fetching user for ${username}`);
      const user = await this.userDBAccessor.fetchUserByUsername(username);
      if(!user) {
        throw Errors.user_authentication_failed;
      }
      let coolDownReached = user.last_log_in_attempt ? Math.abs(user.last_log_in_attempt - new Date()> config.login_cooldown_period)? true: false: false; //checking if the user has reached a cool down period of one hour;
      if(!user.login_attempts || user.login_attempts < config.max_login_attempts || coolDownReached) {
        if (bcrypt.compareSync(password, user.hash)) {
          this.logMessage(scope, "authenticateUser", "User verified successfully");
          user.login_attempts = 0;
          user.last_logged_in = new Date();
          await user.save();
          return {
            user_id: user.user_id, 
            username: user.username,
            name: `${user.first_name} ${user.last_name}`,
            favourite_team: user.favourite_team
          };
        } else {
          this.logMessage(scope, "authenticateUser", "Invalid user credentials");
          user.login_attempts =  user.login_attempts ? user.login_attempts+=1 : 1;
          user.last_log_in_attempt = new Date();
          await user.save();
          throw Errors.user_authentication_failed;  
        } 
      } else {
        this.logMessage(scope, "authenticateUser", "Execeeded login attempts");
        throw Errors.user_exceeded_login_attempts;
      }
    } catch(error) {
      this.logError(scope, "authenticateUser", error);
      throw error;
    }
  }

  /**
 * @method Checks the whether the user exists in the system
 * @author Arun Sanjeevy
 * @param {string} username - the username
 * @return {boolean} - returns true if the user exists else false 
 */
  async checkUserExists(username) {
    try {
      if(!username)  return false;
      this.logMessage(scope, "checkUserExists", `Fetching user for ${username}`);
      let user = await this.userDBAccessor.fetchUserByUsername(username);
      if (user) {
        this.logMessage(scope, "checkUserExists", "Fetched user successfully");
        return true;
      } else {
        this.logMessage(scope, "checkUserExists", "User doesnt exist");
        return false;
      }
    } catch(error) {
      this.logError(scope, "checkUserExists", error);
      throw error;
    }
  }
}

module.exports = UserController;