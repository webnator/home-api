'use strict';

const LogService = require('./../../services/LogService');
const RequestService = require('./../../services/RequestService');

const responses = require('./responses');

const initEntity = require('./Entity');
const initService = require('./Service');


const entity = initEntity({
  LogService,
  responses,
  RequestService
});

const service = initService({
  Music: entity,
  LogService
});

module.exports = service;
