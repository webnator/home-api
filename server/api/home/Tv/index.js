'use strict';

const LogService = require('./../../services/LogService');
//const config = require('./../../../config/environment');


/** The Class to handle Tv */
class Tv {
  constructor(logData) {
    this.logData = logData;
  }

  /**
   * Creates a new interview in blocknotary
   * @param {Object} data - The container object
   * @returns {Promise}
   */
  playPause(data) {
    return new Promise((resolve, reject) => {
      LogService.info(this.logData, 'Tv playPause | Accessing');
      console.log(data);
      return resolve(data);
    });
  }

}

module.exports = Tv;
