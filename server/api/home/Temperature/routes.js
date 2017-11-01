'use strict';

const temperatureController = require('./../controllers/temperatureController');

module.exports = function(server) {

  server.route({
    method: 'POST',
    path: '/temperature',
    handler: temperatureController.handleTemperature
  });

  server.route({
    method: 'GET',
    path: '/temperature',
    handler: temperatureController.getTemperature
  });

  server.route({
    method: 'GET',
    path: '/health',
    handler: (request, reply) => {
      return reply({ message: 'All good'}).code(200);
    }
  })

};
