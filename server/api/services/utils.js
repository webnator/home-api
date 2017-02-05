'use strict';

const Joi = require('joi');
const crypto = require('crypto');

const GlobalModule = require('./../../global');
const LogService    = require('./LogService');
const config = require('../../config/environment/index');
const denizenLibRequest = require('denizen-lib-request').init(config.appName, config.host);

const sendRequest = denizenLibRequest.sendRequest;
exports.sendRequest = sendRequest;

exports.getCollection = getCollection;
exports.createResponseData = createResponseData;
exports.validateSchema = validateSchema;
exports.createInternalResponse = createInternalResponse;
exports.generateToken = generateToken;

function generateToken (bytes, format){
  return crypto.randomBytes(bytes).toString(format);
}

function getCollection(colName) {
  return GlobalModule.getConfigValue('db').collection(colName);
}

function createResponseData(logData, result, data, extra) {
  let response = {
    statusCode: result.statusCode,
    body: {
      result: JSON.parse(JSON.stringify(result))
    }
  };
  response.body.result.trace = logData.uuid;
  if (data) {
    response.body.data = data;
  }
  if (extra) {
    response.body.extra = extra;
  }

  delete response.body.result.statusCode;
  return response;
}


function validateSchema(data) {
  return new Promise((resolve, reject) => {
    LogService.info(data.logData, 'Utils validateSchema');
    Joi.validate(data.payload, data.schema, function (err, val) {
      if (err) {
        let customErr, error;
        if (err.details[0].context.key && err.details[0].context.key.indexOf('||') !== -1) {
          customErr = err.details[0].context.key.split('||');
          error = {
            message: customErr[0],
            code: customErr[1],
            statusCode: 400
          };
        } else {
          customErr = err.details[0].context.key + ' is not allowed';
          error = {
            message: customErr,
            code: 'NOTALLOWED1001',
            statusCode: 400
          };
        }
        LogService.info(data.logData, 'Utils validateSchema KO', error);
        return reject(error);
      } else {
        data.rawPayload = data.payload;
        data.payload = val;
        LogService.info(data.logData, 'Utils validateSchema OK');
        return resolve(data);
      }
    });
  });
}

function createInternalResponse(statusCode, code, message) {
  return {
    statusCode: statusCode,
    code: code,
    message: message
  };
}
