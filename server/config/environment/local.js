'use strict';

// Development specific configuration
// ==================================
module.exports = {
  ip              : 'localhost',
  port            : 9000,
  ddbbPort        : 27000,

  mongoSettings   : {
    'url': 'mongodb://localhost:27000/hermesms',
    'settings': {
      'db': {
        'native_parser': false
      }
    }
  },

  queueConfig: {
    host: '192.168.1.150',
    port: 1889,
    user: 'homealexa1989',
    password: 'mX9qv4tW5'
  },

  kodiConfig: {
    host: 'http://192.168.1.150:8080/jsonrpc'
  }

};
