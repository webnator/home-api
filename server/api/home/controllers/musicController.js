'use strict';

// Utils
let Errors      = require('./../../services/errors');
let Utils       = require('./../../services/utils');
let LogService  = require('./../../services/LogService');

let MusicService = require('./../Music/');
let responses = require('./../Music/responses');

class MusicController {
  constructor() {}

  /**
   * Gets the current playing song from spotify
   * FROM GET - /music/playing
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static getCurrentSong(request, reply) {
    let data = {
      logData: LogService.logData(request)
    };
    let response;
    LogService.info(data.logData, 'MusicController getCurrentSong | Accessing');
    MusicService.getCurrentSong(data)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.get_current_song_ok, data.currentSong);
        LogService.info(data.logData, 'MusicController getCurrentSong | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'MusicController getCurrentSong KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

  /**
   * Gets the current playing song from spotify
   * FROM PUT - /music/{action}
   * @public
   * @param {Object} request - The http request object
   * @param {Function} reply - The reply callback
   */
  static controlMusic(request, reply) {
    let data = {
      logData: LogService.logData(request),
      params: request.params
    };
    let response;
    LogService.info(data.logData, 'MusicController controlMusic | Accessing');
    MusicService.control(data)
      .then(MusicService.getCurrentSong)
      .then((data) => {
        response = Utils.createResponseData(data.logData, responses.music_changed_ok, data.currentSong);
        LogService.info(data.logData, 'MusicController controlMusic | OK', response);
        return reply(response.body).code(response.statusCode);
      })
      .catch((err) => {
        response = Errors.createGeneralError(err, data.logData);
        LogService.error(data.logData, 'MusicController controlMusic KO - Error: ', response);
        return reply(response.body).code(response.statusCode);
      });
  }

}

module.exports = MusicController;
