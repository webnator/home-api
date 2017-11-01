'use strict';

module.exports = (deps) => {
  const {
    Temperature,
    LogService
  } = deps;

  /** Static class to communicate with the Interview class methods */
  class TemperatureService {
    /**
     * Stores the received temperature into the DDBB
     * @public
     * @static
     * @params {Object} temperature - The temperature object payload
     * @params {String} type - The source of the readings
     * @params {Object} logData - The log object
     * @returns {Promise}
     */
    static async handleTemperature({temperature, type, logData}) {
      LogService.info(logData, 'TemperatureService storeTemperature | Accessing');
      const myTemperature = new Temperature({temperatureData: temperature, type, logData});

      try {
        await myTemperature.saveTemperature();
        await myTemperature.executeAction();
        LogService.info(logData, 'TemperatureService storeTemperature | OK');
      } catch (err) {
        LogService.error(logData, 'TemperatureService storeTemperature | KO', err);
        throw err;
      }
    }

    /**
     * Gets the list of stored temperatures
     * @public
     * @static
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    static getTemperatureData(data) {
      return new Promise(function(resolve, reject) {
        LogService.info(data.logData, 'TemperatureService getTemperatureData | Accessing');

        data.temperature = new Temperature();
        data.temperature.setSearchParams(data.query);
        data.temperature.fetchTemperatures(data)
          .then(() => {
            data.temperatureResponse = data.temperature.getTemperatureResponse();
            LogService.info(data.logData, 'TemperatureService getTemperatureData | OK');
            return resolve(data);
          }).catch((err) => {
            LogService.error(data.logData, 'TemperatureService getTemperatureData | KO', err);
            return reject(err);
          });
      });
    }
  }

  return TemperatureService;

};
