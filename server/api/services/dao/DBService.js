'use strict';

const GlobalModule = require('./../../../global');
const Responses = require('./dbServiceResponses');
const LogService = require('./../LogService');

class DBService {

	constructor() {
		/*
		 * Method from parent class to be implemented at all the children to know de collection name from the repository
		 */
		if (this.getCollectionName === undefined) {
			throw new TypeError('Children class must implement method getCollectionName');
		}
	}

	/**
	 * Method from parent class to get the collection
	 * @public
	 * @return {Object} result - The collection
	 */
	getCollection () {
	  return GlobalModule.getConfigValue('db').collection(this.getCollectionName());
	}

  /**
   * Method from parent class to persist an entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   */
  insert(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService insert - DDBB start');
      let collection = this.getCollection();
      collection.insert(data.query.entity, function(err) {
        if (err) {
          LogService.error(data.logData, 'DBService insert - DDBB Error - KO', err);
          return reject(Responses.internal_ddbb_error);
        }
        LogService.info(data.logData, 'DBService insert - DDBB Successfully - OK');
        return resolve(data);
      });
    });
  }

  /**
   * Method from parent class to delete an entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   */
  remove(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService remove - DDBB start');
      let collection = this.getCollection();

      let options = {};
      if (data.query.options) {
        options = data.query.options;
      }
      collection.remove(data.query.entity, options, function(err) {
        if (err) {
          LogService.error(data.logData, 'DBService remove - DDBB Error - KO', err);
          return reject(Responses.internal_ddbb_error);
        }
        LogService.info(data.logData, 'DBService remove - DDBB Successfully - OK');
        return resolve(data);
      });
    });
  }

  /**
   * Method from parent class to update an entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   */
  update(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService update - DDBB start');
      let collection = this.getCollection();
      let query = data.query.query;
      let update = data.query.entity;
      let options = {};
      if (data.query.options) {
        options = data.query.options;
      }

      collection.update(query, update, options, function (err) {
        if (err) {
          LogService.error(data.logData, 'DBService update | DDBB Error', err);
          return reject(Responses.internal_ddbb_error);
        } else {
          LogService.info(data.logData, 'DBService update | DDBB OK');
          return resolve(data);
        }
      });

    });
  }

  /**
   * Method from parent class to findAndModify an entity returning it
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   */
  findAndModify(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService findAndModify - DDBB start');
      let collection = this.getCollection();

      let query = data.query.query;
      let update = data.query.entity;
      let options = {};
      if (data.query.options) {
        options = data.query.options;
      }
      let sort = data.query.sort || {};

      collection.findAndModify(query, sort, update, options, function (err, result) {
        if (err) {
          LogService.error(data.logData, 'DBService findAndModify | DDBB Error', err);
          return reject(Responses.internal_ddbb_error);
        } else {
          data.query.result = result;
          LogService.info(data.logData, 'DBService findAndModify | DDBB OK');
          return resolve(data);
        }
      });
    });
  }

  /**
   * Method from parent class to find and modify an entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   */
  insertUnique(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService insert - DDBB start');
      let collection = this.getCollection();
      let query = data.query.query;
      let update = { $setOnInsert: data.query.entity };

      collection.findAndModify(query, [['uuid', 1]], update, {upsert: true, new: true}, function (err, doc) {
        if (err) {
          LogService.error(data.logData, 'DBService insertUnique | DDBB Error', err);
          return reject(Responses.internal_ddbb_error);
        } else {
          if (doc && doc.lastErrorObject && doc.lastErrorObject.updatedExisting === false) {
            LogService.info(data.logData, 'DBService insertUnique | OK');
            return resolve(data);
          } else {
            LogService.error(data.logData, 'DBService insertUnique | KO - entity exists');
            return reject(Responses.entity_exists);
          }
        }
      });

    });
  }

  /**
   * Method from parent class to retrieve an array entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   * @return {Array} data.query.result - The array of entities returned by the DDBB
   */
  find(data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService find | accessing');
      let collection = this.getCollection();
      let projection = {};
      let sort = {};
      let limit = 0;
      if (data.query.projection) {
        projection = data.query.projection;
      }
      if (data.query.sort) {
        sort = data.query.sort;
      }
      if (data.query.limit) {
        limit = data.query.limit;
      }

      collection.find(data.query.query, projection).limit(limit).sort(sort).toArray(function(err, result) {
        if (err) {
          LogService.error(data.logData, 'DBService find | KO', err);
          return reject(Responses.internal_ddbb_error);
        }
        data.query.result = result;
        LogService.info(data.logData, 'DBService find | OK');
        return resolve(data);
      });
    });
  }

  /**
   * Method from parent class to retrieve a single entity
   * @public
   * @param {Object} data - The container object
   * @param {Object} data.query - The object with the mongo query
   * @return {Promise}
   * @return {Object} data.query.result - The entity returned by the DDBB
   */
  findOne (data) {
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService findOne - DDBB start');
      let collection = this.getCollection();
      let projection = {};
      if (data.query.projection) {
        projection = data.query.projection;
      }
      collection.findOne(data.query.query, projection, function(err, result) {
        if (err) {
          LogService.error(data.logData, 'DBService findOne - DDBB Error - KO', err);
          return reject(Responses.location500);
        }
        data.query.result = result;
        LogService.info(data.logData, 'DBService findOne - DDBB Successfully - OK');
        return resolve(data);
      });
    });
  }

  aggregate(data){
    return new Promise((resolve, reject) => {
      LogService.info(data.logData, 'DBService aggregate - DDBB start');
      let collection = this.getCollection();
      collection.aggregate(data.query, function(err, result) {
        if (err) {
          LogService.error(data.logData, 'DBService find - DDBB Error - KO', err);
          return reject(Responses.location500);
        }
        data.query.result = result;
        LogService.info(data.logData, 'DBService find - DDBB Successfully - OK');
        return resolve(data);
      });
    });
  }
}

module.exports = DBService;