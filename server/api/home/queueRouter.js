'use strict';

const temperatureController = require('./controllers/temperatureController');

module.exports = function(server) {
  server.route({
    topic: 'tele/living_room/SENSOR',
    handler: temperatureController.handleTemperature
  });

  server.route({
    topic: 'tele/pet_house/SENSOR',
    handler: temperatureController.handleTemperature
  });
};
