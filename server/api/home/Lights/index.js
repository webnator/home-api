'use strict';

const LogService = require('./../../services/LogService');
const mqttService = require('./../../services/MqttService');

const responses = require('./responses');

const initEntity = require('./Entity');
const initService = require('./Service');


const entity = initEntity({
  LogService,
  responses,
  mqttService
});

const service = initService({
  Lights: entity,
  LogService
});

module.exports = service;
