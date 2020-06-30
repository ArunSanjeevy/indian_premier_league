'use strict'

const UserController = require('../controllers/user_controller');

/**
 * @method generic route authentication middleware which validates the session and the user data in the session
 * @author Arun Sanjeevy
 */
const auth = async (request, response, next) => {
  if(request.session.user) {
    let userController = new UserController();
    let username = request.session.username;
    let isUserExists = userController.checkUserExists(username)
    if(isUserExists) { 
      next(); 
    } else {
      response.status(401).json({error: "Sorry, authentication failed"});
    }
  } else {
    response.status(401).json({error: "Sorry, authentication failed"})
  }
}

module.exports = { auth };