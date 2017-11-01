'use strict';

// Utils
const Errors      = require('./../../services/errors');
const Utils       = require('./../../services/utils');
const LogService  = require('./../../services/LogService');

const LightsService = require('./../Lights/');
const responses = require('./../Lights/responses');

const LightStateSchema = require('./../models/LightsStateSchema');

class LightsController {
  constructor() {}

  /**
   * Gets the current playing song from spotify
   * FROM GET - /lights
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static getLightsCatalog(request, reply) {
    let data = {
      logData: LogService.logData(request)
    };
    let response;
    LogService.info(data.logData, 'LightsController getLightsCatalog | Accessing');
    LightsService.getLightsCatalog(data)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.get_lights_ok, data.lightCatalog);
        LogService.info(data.logData, 'LightsController getLightsCatalog | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'LightsController getLightsCatalog KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

  /**
   * Gets the current playing song from spotify
   * FROM PUT - /lights/:lightId
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static changeLightState(request, reply) {
    let data = {
      logData: LogService.logData(request),
      payload: Object.assign({}, request.payload, request.params),
      schema: new LightStateSchema()
    };
    let response;
    LogService.info(data.logData, 'LightsController changeLightState | Accessing');
    Utils.validateSchema(data)
      .then(LightsService.changeLightState)
      .then(() => {
        response = Utils.createResponseData(data.logData, responses.set_light_state_ok);
        LogService.info(data.logData, 'LightsController changeLightState | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'LightsController changeLightState KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }



}

module.exports = LightsController;
