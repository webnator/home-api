/**
 * Main application file
 */
'use strict';
// Set default node environment to development

var Hapi          = require('hapi');
var config        = require('./config/environment');
var GlobalModule  = require('./global.js');

// Create a server with a host and port
var server;

var setOptions = function () {
  var opts = {};
  opts.routes = {prefix: config.routes.prefix};
  return opts;
};


var init = function () {
  return new Promise((resolve, reject) => {
    // Create a server with a host and port
    server = new Hapi.Server();
    server.connection({port: config.port, routes: {cors: true}});
    // JWT Auth Strategy

    // Register the server and start the application
    server.register(
      [
        {register: require('./routes')},
        //{register: require('hapi-mongodb'), options: config.mongoSettings}
      ],
      setOptions(),
      function (err) {
        if (err) {
          return reject(err);
        }
        server.start(function (err) {
          if (err) {
            return reject(err);
          }
          //GlobalModule.setConfigValue('db', server.plugins['hapi-mongodb'].db);
          return resolve(server);
        });
      }
    );
  });
};

var stopServer = function() {
  return new Promise((resolve, reject) => {
    //GlobalModule.getConfigValue('db').close();
    server.stop(function (err) {
      if (err) {
        return reject(err);
      }
      console.log('Server stopped');
      return resolve(server);
    });
  });
};

exports.init = init;
exports.stopServer = stopServer;
