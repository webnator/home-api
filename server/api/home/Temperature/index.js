'use strict';

const DBService = require('./../../services/dao/DBService');
const LogService = require('./../../services/LogService');

const responses = require('./responses');
const COLLECTION_NAME = 'temperature';

const initEntity = require('./Entity');
const initDAO = require('./DAO');
const initService = require('./Service');
const ActionsFactory = require('./actions/TemperatureActionsFactory');

const DAO = initDAO({
  DBService,
  collectionName: COLLECTION_NAME,
  LogService,
});

const entity = initEntity({
  LogService,
  DAO,
  responses,
  ActionsFactory,
});

const service = initService({
  Temperature: entity,
  LogService,
});

module.exports = service;
