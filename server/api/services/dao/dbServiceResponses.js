'use strict';

const utils = require('./../utils');

module.exports = {
  internal_ddbb_error: utils.createInternalResponse(500, '50000','Internal DDBB Error'),

  aggregator404: utils.createInternalResponse(404, '40400','Resource not found'),

  aggregator500: utils.createInternalResponse(500, '50001','General error')
};
