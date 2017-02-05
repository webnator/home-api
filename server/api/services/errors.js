'use strict';

exports.createGeneralError = function (err, logData) {
  return {
    statusCode: err.statusCode || 500,
    body: {
      result: {
        code      : err.code || '50000',
        message   : err.message,
        trace     : logData.uuid
      }
    }
  };
};