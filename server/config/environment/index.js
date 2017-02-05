'use strict';

let _ = require('lodash');

// All configurations will extend these options
// ============================================
let all = {
  env: process.env.HOME_DISPATCHER_NODE_ENV,
  host: process.env.HOME_DISPATCHER_IP || 'localhost',
  appName: 'home:dispatcher',
  routes: {
    prefix: '/v1/home'
  }

};

console.log('Runing in ', process.env.HOME_DISPATCHER_NODE_ENV, 'mode');

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.HOME_DISPATCHER_NODE_ENV) || {});
