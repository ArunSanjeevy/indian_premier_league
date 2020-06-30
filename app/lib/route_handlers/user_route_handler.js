'use strict'

const UserController = require('../controllers/user_controller');
const BaseHelper = require('../helpers/base');
const scope = "UserRouteHandler";

class UserRouteHandler extends BaseHelper{
  constructor() {
    super();
    this.userController = new UserController();
  }

  // Each method is a handler function for each route accepting the http request, response parameters

  async userSignUpRoute(request, response, next) {
    try {
      this.logInfo(scope, "userSignUpRoute", { http_method:request.method, request_url: request.originalUrl});
      await this.userController.createUser(request.body);
      this.logMessage(scope, "userSignUpRoute", `${request.body.username} signed up successfully`);
      response.status(200).json({message: "User created sucessfully"});
    } catch(error) {
      this.logError(scope, "userSignUpRoute", error);
      next(error);
    }
  }

  async userLoginRoute(request, response, next) {
    try {
      this.logInfo(scope, "userLoginRoute", { http_method:request.method, request_url: request.originalUrl});
      let result = await this.userController.authenticateUser(request.body);
      request.session.user = result;
      this.logMessage(scope, "userLoginRoute", `${result.username} logged in successfully`);
      response.status(200).json({message: `${result.username} logged in successfully`});
    } catch(error) {
      this.logError(scope, "userLoginRoute", error);
      next(error);
    }
  }

  async userLogoutRoute(request, response, next) {
    try {
      this.logInfo(scope, "userLogoutRoute", { http_method:request.method, request_url: request.originalUrl});
      request.session = null;
      this.logMessage(scope, "userLogoutRoute", `Logged out successfully`);
      response.status(200).json({message: `Logged out successfully`});
    } catch(error) {
      this.logError(scope, "userLogoutRoute", error);
      next(error);
    }
  }    
}

module.exports = new UserRouteHandler();