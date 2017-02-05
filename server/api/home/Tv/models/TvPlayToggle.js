'use strict';

function TvPlayToggle() {
  return {
    jsonrpc: '2.0',
    method: 'Player.PlayPause',
    params: {
      playerid: 1
    },
    id: 1
  };
}

module.exports = TvPlayToggle;
