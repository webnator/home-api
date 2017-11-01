/**
 * Main application routes
 */

'use strict';

exports.register = function(server, options, next) {
  require('./api/home/Temperature/routes')(server);
  require('./api/home/Music/routes')(server);
  require('./api/home/Lights/routes')(server);
  next();
};

exports.register.attributes = {
  name: 'home-monitor-routes',
  version: '0.0.1'
};
