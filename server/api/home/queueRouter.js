'use strict';

const tvController = require('./controllers/tvController');

module.exports = function(server) {
  server.route({
    topic: 'home/tv/play',
    handler: tvController.handlePlay
  });

  server.route({
    topic: 'home/tv/reset',
    handler: tvController.resetTv
  });
};
