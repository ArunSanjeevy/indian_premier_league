'use strict'

const test = require('ava');
const UserController = require('../../../lib/controllers/user_controller');
const UserDBAccessor = require('../../../lib/db_accessors/user_db_accessor');
const user_data = require('../../test_data/user_data.json');
const Errors = require('../../../lib/constants/Errors');

const userController = new UserController();
const userDBAccessor = new UserDBAccessor();

test.before(async () => {
  await userDBAccessor._deleteUsers();
  await userDBAccessor._insertUsers(user_data);
});

test.after.always(async () => {
  await userDBAccessor._deleteUsers();
});

test("createUser() -> Should create a new user", async (t) => {
  let user = {
    "username": "test_user",
    "password": "test_user",
    "email": "test_user@gmail.com",
    "first_name": "test_user",
    "last_name": "test_user",
    "favourite_team": "Delhi Capitals"
  }
  await userController.createUser(user);
  let result = await userDBAccessor.fetchUserByUsername(user.username);
  t.is(result.username, user.username);
});

test("createUser() -> Should throw user_already_exists error for duplicate user", async (t) => {
  let user = {
    "username": "user03",
    "password": "user03",
    "email": "user03@gmail.com",
    "first_name": "user03",
    "last_name": "user03",
    "favourite_team": "Delhi Capitals"
  }
  try {
    await userController.createUser(user);
  } catch (error) {
    t.is(error, Errors.user_already_exists)
  }
});

test("authenticateUser() -> Should validate the credentials and if valid return user data", async (t) => {
  let body = {
    "username": "user05",
    "password": "user05"
  }
  let result = await userController.authenticateUser(body)
  t.is(result.username, body.username);
});

test("authenticateUser() -> Should throw authentication failed error for invalid credentials", async (t) => {
  let body = {
    "username": "user05",
    "password": "user044"
  }
  try {
    await userController.authenticateUser(body)
  } catch(error) {
    t.is(error, Errors.user_authentication_failed);
  }
});

test("authenticateUser() -> Should throw user execeeded login attempts after 3 failed login attempts", async (t) => {
  let body = {
    "username": "user05",
    "password": "user044"
  }
  try {
    let user = await userDBAccessor.fetchUserByUsername(body.username);
    user.login_attempts = 3;
    await user.save();
    await userController.authenticateUser(body)
  } catch(error) {
    t.is(error, Errors.user_exceeded_login_attempts);
  }
});

test("checkUserExists() -> Should return true if the user exists for the passed username", async (t) => {
  let username = "user03";
  let result = await userController.checkUserExists(username)
  t.is(result, true);
});

test("checkUserExists() -> Should return false if the user not exists for the passed username", async (t) => {
  let username = "user04";
  let result = await userController.checkUserExists(username)
  t.is(result, false);
});