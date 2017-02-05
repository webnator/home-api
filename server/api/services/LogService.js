'use strict';

const config  = require('./../../config/environment');
const LibLog  = require('denizen-lib-log').initConf({
  hostname: config.host,
  appName: config.appName,
  logLevel: 'info'
});

exports.info    = LibLog.info;
exports.error   = LibLog.error;
exports.logData = LibLog.logData;
