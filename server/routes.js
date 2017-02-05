/**
 * Main application routes
 */

'use strict';

exports.register = function(server, options, next) {
  require('./api/home')(server);
  next();
};

exports.register.attributes = {
  name: 'home-dispatcher-routes',
  version: '0.0.1'
};
