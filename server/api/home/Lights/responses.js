'use strict';

const utils = require('./../../services/utils');

module.exports = {
  get_lights_ok: utils.createInternalResponse(200, '20004', 'The list of available lights was successfully retrieved'),

  set_light_state_ok: utils.createInternalResponse(201, '20100', 'The light state was correctly changed'),

  get_lights_ko: utils.createInternalResponse(500, '50000', 'Error while fetching the lights state'),

};
