'use strict';

const utils = require('./../../services/utils');

module.exports = {
  tv_play_ok: utils.createInternalResponse(200, '20000', 'The tv state was changed'),

  tv_reset_ok: utils.createInternalResponse(200, '20001', 'The tv was resetted'),

  tv_play_ko: utils.createInternalResponse(500, '50000', 'There was an error with the request')
};
