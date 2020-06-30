'use strict'

/**
 * @method generic errorHandler middleware which consumes the error and responds with respective http messages
 * @author Arun Sanjeevy
 */

const errorHandler = (err, req, res, next) => {
  if(err.status_code) {
    //custom error
    return res.status(err.status_code).json({error: err.error_message});
  }
  
  if (typeof (err) === 'string') {
    //application stack trace error
    return res.status(500).json({ error: err });
  }
  
  if (err.name === 'ValidationError') {
    // mongoose validation error
    return res.status(400).json({ error: err.message });
  }
  //default to 500 server error
  return res.status(500).json({ error: err.message });
 
}

module.exports = errorHandler;