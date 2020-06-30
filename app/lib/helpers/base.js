'use strict'

const winston = require('winston');
const winstonDailyRotateFile = require('winston-daily-rotate-file');
const path = require('path');
const rTracer = require('cls-rtracer');
const config = require(`../../config/${process.env.NODE_ENV}-config.json`);

class BaseHelper {
  constructor() {
    const logFormat = winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    );
    const logger = winston.createLogger({
      format: logFormat,
      transports: [
        new winstonDailyRotateFile({
          filename: path.join(config.log_directory_location, 'app-info-%DATE%.log'),
          datePattern: 'YYYY-MM-DD',
          maxsize: 500,
          silent: config.suppress_logs 
        })
      ]
    });
    this.logger = logger;
  }

  /**
 * @method logs 'info' level messages with data 
 * @author Arun Sanjeevy
 * @param {string} scope - the class name or the parent scope
 * @param {string} method - the method name
 * @param {object} data - the data to be logged
 */

  logInfo (scope, method, data) {
    let logValues = {
      requestId: rTracer.id(), scope, method, data
    }
    this.logger.log('info', logValues);
  }

  /**
 * @method logs 'info' level messages with a log message 
 * @author Arun Sanjeevy
 * @param {string} scope - the class name or the parent scope
 * @param {string} method - the method name
 * @param {object} logMessage - the string to be logged
 */

  logMessage (scope, method, logMessage) {
    let logValues = {
      requestId: rTracer.id(), scope, method, logMessage
    }
    this.logger.log('info', logValues);
  }

  /**
 * @method logs 'error' level messages with the error object 
 * @author Arun Sanjeevy
 * @param {string} scope - the class name or the parent scope
 * @param {string} method - the method name
 * @param {object} error - the error to be logged
 */
  
  logError (scope, method, error) {
    let logValues = {
      requestId: rTracer.id(), scope, method, error
    }
    this.logger.log('error', logValues);
  }

  //TODO: implement customer middleware instead of cls-tracer to generate requestContext with request id to trace the requests through logs
}

module.exports = BaseHelper;