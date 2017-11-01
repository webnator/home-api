'use strict';

const TemperatureResponseModel = require('./models/TemperatureResponse');

module.exports = (deps) => {
  const {
    LogService,
    DAO,
    responses,
    ActionsFactory
  } = deps;

  /** The Class to handle Temperature */
  class Temperature {
    constructor({temperatureData, type, logData}) {
      if (temperatureData) {
        this.setTemperatureTime(temperatureData.Time);
        if (temperatureData.DHT11) {
          this.setHumidity(temperatureData.DHT11.Humidity);
          this.setTemperature(temperatureData.DHT11.Temperature);
        }

      }
      this.logData = logData;
      this.type = type;
      this.repository = new DAO();
      this.action = ActionsFactory.getAction(type);
    }

    setSearchParams(query) {
      this.searchParams = query;
    }
    setTemperatureTime(time) {
      this.time = new Date(time);
    }
    setHumidity(humidity) {
      this.humidity = humidity;
    }
    setTemperature(temperature) {
      this.temperature = temperature;
    }
    setDBTemperatures(temperatures) {
      this.DBTemperatures = temperatures;
    }

    getTemperature() {
      return {
        storedTime: new Date(),
        sensorTime: this.time,
        humidity: this.humidity,
        temperature: this.temperature,
        type: this.type
      };
    }
    getSearchParams() {
      return this.searchParams;
    }
    getTemperatureResponse() {
      return new TemperatureResponseModel(this.DBTemperatures);
    }

    /**
     * Stores the received temperature into the DDBB
     * @returns {Promise}
     */
    async saveTemperature() {
      LogService.info(this.logData, 'Temperature saveTemperature | Accessing');

      let DBObject = {
        logData: this.logData,
        temperature: this.getTemperature()
      };
      try {
        await this.repository.storeTemperature(DBObject);
        LogService.info(this.logData, 'Temperature saveTemperature | OK');
      } catch (err) {
        LogService.error(this.logData, 'Temperature saveTemperature | KO', err);
        throw err;
      }
    }

    /**
     * Executes the action for a particular type of temperature source
     * @returns {Promise}
     */
    async executeAction() {
      LogService.info(this.logData, 'Temperature executeAction | Accessing');

      try {
        if (this.action) {
          const action = new this.action({temperature: this, logData: this.logData});
          await action.execute();
          LogService.info(this.logData, 'Temperature executeAction | OK');
        }
      } catch (err) {
        LogService.error(this.logData, 'Temperature executeAction | KO', err);
        throw err;
      }
    }

    /**
     * Retrieves a list of temperatures from the DDBB
     * @param {Object} data - The container object
     * @returns {Promise}
     */
    fetchTemperatures(data) {
      return new Promise((resolve, reject) => {
        LogService.info(data.logData, 'Temperature fetchTemperatures | Accessing');

        let DBObject = {
          logData: data.logData,
          params: this.getSearchParams()
        };
        this.repository.fetchTemperatures(DBObject).then((res) => {
          this.setDBTemperatures(res.query.result);
          LogService.info(data.logData, 'Temperature fetchTemperatures | OK');
          return resolve(data);
        }).catch((err) => {
          LogService.error(data.logData, 'Temperature fetchTemperatures | KO', err);
          return reject(responses.store_temperature_ko);
        });


      });
    }

  }

  return Temperature;
};

