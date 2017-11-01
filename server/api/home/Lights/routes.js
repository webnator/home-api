'use strict';

const lightsController = require('./../controllers/lightsController');

module.exports = function(server) {

  server.route({
    method: 'GET',
    path: '/lights',
    handler: lightsController.getLightsCatalog
  });

  server.route({
    method: 'PUT',
    path: '/lights/{lightId}',
    handler: lightsController.changeLightState
  });

};
