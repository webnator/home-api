'use strict';

let LogService  = require('./../../services/LogService');
let utils  = require('./../../services/utils');
let config = require('./../../../config/environment');

//let Tv = require('./index');
let TvPlayToggleModel = require('./models/TvPlayToggle');

let responses = require('./responses');

/** Static class to communicate with the Interview class methods */
class TvService {
  /**
   * Toggles play pause for tv
   * @public
   * @static
   * @param {Object} data - The container object
   * @returns {Promise}
   */
  static handlePlay(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'TvService handlePlay | Accessing');

      data.reqData = {
        method: 'POST',
        url: config.kodiConfig.host,
        json: new TvPlayToggleModel()
      };

      utils.sendRequest(data).then((res) => {
        LogService.info(data.logData, 'TvService handlePlay | OK');
        return resolve(data);
      }).catch((err) => {
        LogService.info(data.logData, 'TvService handlePlay | KO', err);
        return reject(responses.tv_play_ko);
      });

    });
  }

  /**
   * Resets the kodi player
   * @public
   * @static
   * @param {Object} data - The container object
   * @returns {Promise}
   */
  static resetTv(data) {
    return new Promise((resolve) => {
      LogService.info(data.logData, 'TvService resetTv | Accessing');

      const exec = require('child_process').exec;
      function puts(error, stdout, stderr) {
        if (error) {
          LogService.error(data.logData, 'TvService resetTv | KO', error);
        }
        if (stderr) {
          LogService.error(data.logData, 'TvService resetTv | Script error', stderr);
        }
        LogService.info(data.logData, 'TvService resetTv | OK');
      }

      exec('pkill kodi && DISPLAY=:0 kodi &', puts);
      return resolve(data);

    });
  }
}

module.exports = TvService;
