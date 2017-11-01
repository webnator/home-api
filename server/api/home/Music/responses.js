'use strict';

const utils = require('./../../services/utils');

module.exports = {
  get_current_song_ok: utils.createInternalResponse(200, '20002', 'The song was retrieved correctly'),

  music_changed_ok: utils.createInternalResponse(200, '20003', 'The action was performed successfully'),

  action_invalid: utils.createInternalResponse(400, '40000', 'That action is not allowed'),

  spotify_api_ko: utils.createInternalResponse(500, '50001', 'There was an error connecting to spotify')
};
