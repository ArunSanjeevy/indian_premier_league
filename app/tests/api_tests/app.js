'use strict'

let server = require('../../app');
let _ = require('lodash');
let Constants = require('../../lib/constants/Constants');
let Errors = require('../../lib/constants/Errors');
let test = require('ava');
let chai = require('chai');
let chaiHttp = require('chai-http');
let setupDB = require('../test_data/seed-data');
chai.use(chaiHttp);
let agent = chai.request.agent(server);

test.before( async () =>{
  await setupDB();
  let body = { username: "user03", password: "user03"};
  await agent.post('/api/v1/users/login').send(body);
});


//GET seasons route

test('GET -> /api/v1/matches/seasons -> Should return a 401 status for unauthenticated requests', async (t) => {
  const response = await chai.request(server).get('/api/v1/matches/seasons');
  t.is(response.status, 401);    
});

test('GET -> /api/v1/matches/seasons -> Should return a unique list of seasons', async (t) => {
  const response = await agent.get('/api/v1/matches/seasons');
  t.is(response.status, 200);  
});

//GET matches for a season route

test('GET -> /api/v1/matches/seasons/2017 -> Should return list of matches of season 2017', async (t) => {
  const response = await agent.get('/api/v1/matches/seasons/2017');
  t.is(response.status, 200);
  t.is(response.body[0].season, 2017);   
});


test('GET -> /api/v1/matches/seasons/20178 -> Should throw bad request error for invalid season value', async (t) => {
  const response = await agent.get('/api/v1/matches/seasons/20179');
  t.is(response.status, 400);   
});

test('GET -> /api/v1/matches/seasons/2025 -> Should throw no matches found error for off-season year', async (t) => {
  const response = await agent.get('/api/v1/matches/seasons/2025');
  t.is(response.status, 404);
  t.is(response.body.error, Errors.matches_not_found_for_season.error_message);   
});

//GET match using match_id route

test('GET -> /api/v1/matches/1 -> Should return 401 for unauthenticated requests', async (t) => {
  const response = await chai.request(server).get('/api/v1/matches/1');
  t.is(response.status, 401);   
});

test('GET -> /api/v1/matches/1 -> Should return a match data', async (t) => {
  const response = await agent.get('/api/v1/matches/1');
  t.is(response.status, 200);
  t.is(response.body.id, 1);   
});

test('GET -> /api/v1/matches/123647489 -> Should return no match found error for invalid match id', async (t) => {
  const response = await agent.get('/api/v1/matches/123647489');
  t.is(response.status, 404);
  t.is(response.body.error, Errors.matches_not_found_for_id.error_message);    
});

//GET team matches route

test('GET -> /api/v1/matches/team -> Should return 401 for unauthenticated requests', async (t) => {
  const response = await chai.request(server).get('/api/v1/matches/team')
    .query({team_name: Constants.team_name.mumbai_indians});
  t.is(response.status, 401);   
});

test('GET -> /api/v1/matches/team -> Should return all the matches of the specified team', async (t) => {
  const response = await agent.get('/api/v1/matches/team')
    .query({team_name: Constants.team_name.mumbai_indians});
  t.is(response.status, 200);
  t.is(response.body[0].team1, Constants.team_name.mumbai_indians);   
});


test('GET -> /api/v1/matches/team -> Should throw bad request error for invalid team name value', async (t) => {
  const response = await agent.get('/api/v1/matches/team')
    .query({team_name: "team mumbai"});
  t.is(response.status, 400);    
});


test('GET -> /api/v1/matches/team -> Should throw bad request error for empty team name value', async (t) => {
  const response = await agent.get('/api/v1/matches/team')
    .query({team_name: ""});
  t.is(response.status, 400);   
});

//POST predict match route

test('POST -> /api/v1/matches/predict -> Should return 401 for unauthenticated request', async (t) => {
  let body = {
    team1: Constants.team_name.mumbai_indians,
    team2: Constants.team_name.kolkata_knight_riders,
    team_to_bat_first: Constants.team_name.mumbai_indians,
    venue: "Chennai"
  }
  const response = await chai.request(server).post('/api/v1/matches/predict').send(body);
  t.is(response.status, 401);
});

test('POST -> /api/v1/matches/predict -> Should return 200 for valid payload', async (t) => {
  let body = {
    team1: Constants.team_name.mumbai_indians,
    team2: Constants.team_name.kolkata_knight_riders,
    team_to_bat_first: Constants.team_name.mumbai_indians,
    venue: "Chennai"
  }
  const response = await agent.post('/api/v1/matches/predict').send(body);
  t.is(response.status, 200);
});

test('POST -> /api/v1/matches/predict -> Should return 400 for invalid team name', async (t) => {
  let body = {
    team1: "india mumbai",
    team2: Constants.team_name.kolkata_knight_riders,
    team_to_bat_first: Constants.team_name.mumbai_indians,
    venue: "Chennai"
  }
  const response = await agent.post('/api/v1/matches/predict').send(body);
  t.is(response.status, 400);
});


//USER login route

test("POST -> /api/v1/users/login -> Should return 200 status code for valid credentials and set the cookie with a valid session", async (t) => {
  let body = { username: "user03", password: "user03"};
  let response = await chai.request(server).post('/api/v1/users/login').send(body);
  t.is(response.status, 200);
  let cookie = _.get(response, "header.set-cookie", null);
  t.not(cookie.length, 0);
  let validate = cookie[0].includes("IPLSESSIONID");
  t.is(validate, true);
});

test("POST -> /api/v1/users/login -> Should return 401  invalid credentials", async (t) => {
  let body = { username: "user03", password: "user90g43"};
  let response = await chai.request(server).post('/api/v1/users/login').send(body);
  t.is(response.status, 401);
});

test("POST -> /api/v1/users/login -> Should return 400 if any field is empty", async (t) => {
  let body = { username: "", password: "user03"};
  let response = await chai.request(server).post('/api/v1/users/login').send(body);
  t.is(response.status, 400);
});

//USER logout route

test("POST -> /api/v1/users/logout -> Should return 401 if request is unauthenticated", async (t) => {
  let response = await chai.request(server).post('/api/v1/users/logout');
  t.is(response.status, 401);
});

test("POST -> /api/v1/users/logout -> Should return 200 and unset the session in the cookie", async (t) => {
  let response = await agent.post('/api/v1/users/logout');
  t.is(response.status, 200);
  let cookie = _.get(response, "header.set-cookie[0].ipl_user_session", null);
  t.is(cookie, null);
});

//USER signup route
test("POST -> /api/v1/users/signup -> Should create new user and return 200", async (t) => {
  let user = {
    "username": "test_user2",
    "password": "test_user2",
    "email": "test_use2@gmail.com",
    "first_name": "test_user2",
    "last_name": "test_user2",
    "favourite_team": "Delhi Capitals"
  }
  const response = await chai.request(server).post('/api/v1/users/signup').send(user);
  t.is(response.status, 200);
});

test("POST -> /api/v1/users/signup -> Should throw user already exists error for existing username", async (t) => {
  let user = {
    "username": "user03",
    "password": "test_user2",
    "email": "test_user2@gmail.com",
    "first_name": "test_user2",
    "last_name": "test_user2",
    "favourite_team": "Delhi Capitals"
  }
  const response = await chai.request(server).post('/api/v1/users/signup').send(user);
  t.is(response.status, 409);
  t.is(response.body.error, Errors.user_already_exists.error_message);
});

test("POST -> /api/v1/users/signup -> Should throw bad request error if any of the field is empty", async (t) => {
  let user = {
    "username": "",
    "password": "test_user2",
    "email": "test_user2@gmail.com",
    "first_name": "test_user2",
    "last_name": "test_user2",
    "favourite_team": "Delhi Capitals"
  }
  const response = await chai.request(server).post('/api/v1/users/signup').send(user);
  t.is(response.status, 400);
});


test("POST -> /api/v1/users/signup -> Should throw bad request error if the email provided is invalid", async (t) => {
  let user = {
    "username": "test_user2",
    "password": "test_user2",
    "email": "test_user2",
    "first_name": "test_user2",
    "last_name": "test_user2",
    "favourite_team": "Delhi Capitals"
  }
  const response = await chai.request(server).post('/api/v1/users/signup').send(user);
  t.is(response.status, 400);
});


test("POST -> /api/v1/users/signup -> Should throw bad request error if the favourite team value is invalid", async (t) => {
  let user = {
    "username": "test_user2",
    "password": "test_user2",
    "email": "test_user2@gmail.com",
    "first_name": "test_user2",
    "last_name": "test_user2",
    "favourite_team": "Delhi Capita"
  }
  const response = await chai.request(server).post('/api/v1/users/signup').send(user);
  t.is(response.status, 400);
});







