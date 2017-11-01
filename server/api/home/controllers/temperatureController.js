'use strict';

// Utils
let Errors      = require('./../../services/errors');
let Utils       = require('./../../services/utils');
let LogService  = require('./../../services/LogService');

let TemperatureService = require('./../Temperature/');
let responses = require('./../Temperature/responses');

class TemperatureController {
  constructor() {}

  /**
   * Saves the living room temperature in the DDBB
   * FROM QUEUE - tele/+/SENSOR
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static async handleTemperature(request, reply) {
    const type = request.path.substring(request.path.indexOf('/')+1, request.path.lastIndexOf('/'));
    const logData = LogService.logData(request);

    LogService.info(logData, 'TemperatureController handleTemperature | Accessing');

    try {
      await TemperatureService.handleTemperature({ temperature: request.payload, type, logData });
      const response = Utils.createResponseData(logData, responses.store_temperature_ok);
      LogService.info(logData, 'TemperatureController handleTemperature | OK', response);
      return reply(response.body).code(response.statusCode);
    } catch (err) {
      const response = Errors.createGeneralError(err, logData);
      LogService.error(logData, 'TemperatureController handleTemperature KO - Error: ', response);
      return reply(response.body).code(response.statusCode);
    }

  }

  /**
   * Gets the living room temperature in the DDBB
   * FROM GET - /temperature
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static getTemperature(request, reply) {
    let data = {
      logData: LogService.logData(request),
      query: request.query
    };
    let response;
    LogService.info(data.logData, 'TemperatureController getTemperature | Accessing');
    TemperatureService.getTemperatureData(data)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.get_temperature_ok, data.temperatureResponse);
        LogService.info(data.logData, 'TemperatureController getTemperature | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'TemperatureController getTemperature KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

}

module.exports = TemperatureController;
