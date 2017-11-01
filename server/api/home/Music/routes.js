'use strict';

const musicController = require('./../controllers/musicController');

module.exports = function(server) {

  server.route({
    method: 'GET',
    path: '/music/playing',
    handler: musicController.getCurrentSong
  });

  server.route({
    method: 'PUT',
    path: '/music/{action}',
    handler: musicController.controlMusic
  })



};
