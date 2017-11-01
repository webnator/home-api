'use strict';

const utils = require('./../../services/utils');

module.exports = {
  store_temperature_ok: utils.createInternalResponse(200, '20000', 'The temperature was set correctly'),

  get_temperature_ok: utils.createInternalResponse(200, '20001', 'The temperature was retrieved correctly'),

  store_temperature_ko: utils.createInternalResponse(500, '50000', 'There was an error with the request')
};
