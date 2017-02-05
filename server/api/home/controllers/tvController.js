'use strict';

// Utils
let Errors      = require('./../../services/errors');
let Utils       = require('./../../services/utils');
let LogService  = require('./../../services/LogService');

let TvService = require('./../Tv/TvService');
let responses = require('./../Tv/responses');

class TvController {
  constructor() {}

  /**
   * Handles the play and pause of the tv
   * FROM QUEUE - home/tv/play
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static handlePlay(request, reply) {
    let data = {
      payload: request.payload,
      logData: LogService.logData(request)
    };
    let response;
    LogService.info(data.logData, 'TvController handlePlay | Accessing');
    TvService.handlePlay(data)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.tv_play_ok);
        LogService.info(data.logData, 'TvController handlePlay | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'TvController handlePlay KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

  /**
   * Handles the reset request for kodi
   * FROM QUEUE - home/tv/reset
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static resetTv(request, reply) {
    let data = {
      payload: request.payload,
      logData: LogService.logData(request)
    };
    let response;
    LogService.info(data.logData, 'TvController resetTv | Accessing');
    TvService.resetTv(data)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.tv_reset_ok);
        LogService.info(data.logData, 'TvController resetTv | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'TvController resetTv KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

}

module.exports = TvController;
