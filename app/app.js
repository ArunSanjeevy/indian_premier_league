'use strict'

process.env.NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'dev';
const express = require('express');
const session = require('cookie-session');
const helmet = require('helmet');
const morgan = require('morgan');
const rTracer = require('cls-rtracer');
const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');

const app = express();

const config = require(`./config/${process.env.NODE_ENV}-config.json`);
const matchesRoutes = require('./lib/routes/matches_routes');
const userRoutes = require('./lib/routes/user_routes');
const errorHandler = require('./lib/middlewares/errorHandler');

app.use(helmet());
app.use(rTracer.expressMiddleware())
app.use(morgan('combined', { skip: (req, res) => process.env.NODE_ENV === 'test' }));
app.use(session(config.session_options));
app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use('/api/v1/users', userRoutes);
app.use('/api/v1/matches', matchesRoutes);


app.use(errorHandler);

app.use(function (req, res, next) {
  res.status(404).send("Sorry can't find that!")
})

app.listen(3000, (err, conn) => {
  if(!err) {
    console.log("Server running on port 3000");
  } else {
    console.log("Server stopped", err);
  }
});

module.exports = app;