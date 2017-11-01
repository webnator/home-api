'use strict';

const config = require('./../../../config/environment');

module.exports = (deps) => {
  const {
    LogService,
    responses,
    mqttService
  } = deps;

  /** The Class to handle Lights */
  class Lights {
    constructor() {
      this.catalog = config.lights;
    }

    getLights() {
      return this.catalog;
    }

    setLightState(light, state) {
      let stateLight = this.getLight(light);
      if (stateLight) {
        stateLight.state = state;
      }
    }

    getLight(light) {
      return this.catalog.find(l => l.id === light);
    }

    /**
     * Changes the state for a light
     * @param logData {Object} - The log info for the current request
     * @param lightId {String} - The id of the light
     * @param state {String} - The new state for the light
     */
    switchState(logData, lightId, state) {
      LogService.info(logData, 'Lights fetchAllLightsStates | Accessing');
      const light = this.getLight(lightId);
      return mqttService.publishToTopic(light.topic, state);
    }

    /**
     * Fetches the state of the lights from the queue
     * @param logData {Object} - The log info for the current request
     * @returns {Promise.<*>}
     */
    async fetchAllLightsStates(logData) {
      LogService.info(logData, 'Lights fetchAllLightsStates | Accessing');
      try {
        for (let i = 0; i < this.catalog.length; i++) {
          const light = this.catalog[i];
          const state = await this.fetchLightState(logData, light.topic, light.stateTopic);
          this.setLightState(light.id, state);
          LogService.info(logData, 'Lights fetchAllLightsStates | Received ' + light.id + ' state');
        }
        LogService.info(logData, 'Lights fetchAllLightsStates | OK');
      } catch(err) {
        LogService.error(logData, 'Lights fetchAllLightsStates | KO', err);
        throw responses.get_lights_ko;
      }
    }

    async fetchLightState(logData, lightTopic, stateTopic) {
      LogService.info(logData, 'Lights fetchLightState | Accessing');
      return new Promise(async (resolve) => {
        await mqttService.publishAndWaitResponse({
          subscribeTopic: stateTopic,
          publishTopic: lightTopic,
          callback: (message) => {
            const state = JSON.parse(message).POWER;
            LogService.info(logData, 'Lights fetchLightState | OK', state);
            return resolve(state);
          }
        });
      });
    }

  }

  return Lights;

};
