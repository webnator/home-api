'use strict';


module.exports = (deps) => {
  const {
    DBService,
    collectionName,
    LogService
  } = deps;

  class TemperatureDAO extends DBService {

    constructor() {
      super();
    }

    getCollectionName() {
      return collectionName;
    }

    /**
     * Saves a document into the ddbb
     * @param {Object} DBObject - The data object
     * @public
     * @return {Promise}
     */
    storeTemperature(DBObject) {
      LogService.info(DBObject.logData, 'TemperatureDAO storeTemperature | Accessing');
      DBObject.query = {
        entity: DBObject.temperature
      };
      return super.insert(DBObject);
    }

    /**
     * Retrieves a list of documents from the ddbb
     * @param {Object} DBObject - The data object
     * @public
     * @return {Promise}
     */
    fetchTemperatures(DBObject) {
      LogService.info(DBObject.logData, 'TemperatureDAO storeTemperature | Accessing');
      let DAOData = {
        query: {
          query: {}
        },
        logData: DBObject.logData
      };

      if (DBObject.params) {
        if (DBObject.params.from) {
          if (!DAOData.query.query.storedTime) {
            DAOData.query.query.storedTime = {}
          }
          DAOData.query.query.storedTime.$gte = new Date(DBObject.params.from);
        }
        if (DBObject.params.to) {
          if (!DAOData.query.query.storedTime) {
            DAOData.query.query.storedTime = {}
          }
          DAOData.query.query.storedTime.$lte = new Date(DBObject.params.to);
        }
      }

      return super.find(DAOData);
    }


  }

  return TemperatureDAO;

};