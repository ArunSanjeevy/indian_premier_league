'use strict'

const mongoose = require("mongoose");
const config = require(`../../config/${process.env.NODE_ENV}-config.json`);
const mongoDbUrl = config.connection_string;
const appDbConnection = mongoose.createConnection(mongoDbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true
});

const appDbConnect = (uri) => {
  return mongoose.createConnection(uri, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
  })
}

appDbConnection.on("error", console.error.bind(console, "MongoDB connection error!"));

appDbConnection.once("open", () => {
  console.log(`Application connected ${mongoDbUrl}`);
});

process.on('SIGINT', () => {
  appDbConnection.close(function()
  {
    console.log("Mongo DB disconnected due to app termination")
    process.exit(0);
  });  
});

process.on('SIGTERM', () => {
  appDbConnection.close(function()
  {
    console.log("Mongo DB disconnected due to Heroku temination")
    process.exit(0);
  });
});

module.exports = { appDbConnection, appDbConnect };
