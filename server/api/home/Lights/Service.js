'use strict';

module.exports = (deps) => {
  const {
    Lights,
    LogService
  } = deps;

  /** Static class to communicate with the Interview class methods */
  class LightsService {

    /**
     * Gets the available lights and state
     * @public
     * @static
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    static async getLightsCatalog(data) {
      LogService.info(data.logData, 'LightsService getLightsCatalog | Accessing');

      data.lights = new Lights();
      try {
        await data.lights.fetchAllLightsStates(data.logData);
        data.lightCatalog = data.lights.getLights();
        LogService.info(data.logData, 'LightsService getLightsCatalog | OK');
        return Promise.resolve(data);
      } catch (err) {
        LogService.error(data.logData, 'LightsService getLightsCatalog | KO', err);
        return Promise.reject(err);
      }
    }

    /**
     * Changes the state of a light
     * @public
     * @static
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    static async changeLightState(data) {
      LogService.info(data.logData, 'LightsService changeLightState | Accessing');

      data.lights = new Lights();
      try {
        await data.lights.switchState(data.logData, data.payload.lightId, data.payload.power);
        LogService.info(data.logData, 'LightsService changeLightState | OK');
        return Promise.resolve(data);
      } catch (err) {
        LogService.error(data.logData, 'LightsService changeLightState | KO', err);
        return Promise.reject(err);
      }
    }

  }

  return LightsService;
};

