'use strict'

const { User }  = require('../models/index');
const BaseHelper = require('../helpers/base');
const scope = "UserDBAccessor";

class UserDBAccessor extends BaseHelper{
  constructor() {
    super();
  }

  /**
 * @method Inserts the passed user data into the Users collection
 * @author Arun Sanjeevy
 * @param {object} user - the user data
 * @return {object} - returns the inserted user
 */

  async insertUser(user) {
    try {
      this.logMessage(scope, "insertUser", "Inserting user");
      this.logInfo(scope, "insertUser", user);
      let new_user = new User(user);
      let result = await new_user.save()  
      return result;
    } catch(error) {
      this.logError(scope, "insertUser", error);
      throw error;
    }
  }

  /**
 * @method deletes all users
 * @author Arun Sanjeevy
 * @access Private-Only for internal use
 * @param {void} - Nothing
 * @return {void} - Nothing
 */

  async _deleteUsers() {
    try {
      this.logMessage(scope, "_deleteUsers", "Deleting all users");
      await User.deleteMany({});  
    } catch(error) {
      this.logError(scope, "_deleteUsers", error);
      throw error;
    }
  }

  /**
 * @method inserts an array of users
 * @author Arun Sanjeevy
 * @access Private-Only for internal use
 * @param {object} users - user datas to be inserted into the db
 * @return {void} - Nothing
 * @todo Need to validate the users array before inserting into the db
 */

  async _insertUsers(users) {
    try {
      this.logMessage(scope, "_insertUsers", `Inserting ${users.length} user records`);
      await User.insertMany(users);  
    } catch(error) {
      this.logError(scope, "_insertUsers", error);
      throw error;
    }
  }

  /**
 * @method Fetches the user data of the passed username
 * @author Arun Sanjeevy
 * @param {string} username - username for which the data needs to be fetched
 * @return {object} - returns user data
 */

  async fetchUserByUsername(username) {
    try {
      this.logMessage(scope, "fetchUserByUsername", `Fetching data for ${username}`);
      return await User.findOne({username})
    } catch(error) {
      this.logError(scope, "fetchUserByUsername", error);
      throw error;
    }
  }

  /**
 * @method Fetches the user data of the passed user_id
 * @author Arun Sanjeevy
 * @param {string} user_id - user_id (uuid) for which the data needs to be fetched
 * @return {object} - returns user data
 */

  async fetchUserByUserId(user_id) {
    try {
      this.logMessage(scope, "fetchUserByUserId", `Fetching data for ${user_id}`);
      return await User.findOne({user_id})
    } catch(error) {
      this.logError(scope, "fetchUserByUserId", error);
      throw error;
    }
  }
}

module.exports = UserDBAccessor;