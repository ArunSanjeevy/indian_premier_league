'use strict'

const _ = require('lodash');

/**
 * @method generic request payload validator middleware which validates the request data against pre-defined joi schemas 
 * @author Arun Sanjeevy
 * @throws throws error if the validation fails
 */
const validator = async (request, response, next, schemas) => {
  try {
    if(!_.isEmpty(request.query)) {
      let { error, result } = await schemas.query.validate(request.query);
      if (error) throw error;
    }
    if(!_.isEmpty(request.params)) {
      let { error, result } = await schemas.params.validate(request.params);
      if (error) throw error;
    }
    if(!_.isEmpty(request.body)) {
      let { error, result } = await schemas.body.validate(request.body);
      if (error) throw error;
    }
    next();
  } catch(error) {
    response.status(400).json({error: error.details[0].message});
  }
};

module.exports = { validator };
