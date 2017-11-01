'use strict';

const RequestLib = require('denizen-lib-request');

class RequestService {
  constructor({baseUrl, url, method, body, form, headers, params, query}) {
    this._req = {
      baseUrl,
      url,
      method,
      body,
      form,
      headers: headers || {},
      params: params || {},
      query: query || {},
    };
    this.sendRequest = RequestLib.sendRequest;
  }

  async request({logData, params, responses, fallback}) {
    let req = RequestService.createRequestObject(Object.assign({}, this._req, params));
    let data = {
      logData: logData,
      reqData: req
    };

    return this.sendRequest(data).then((data) => {
      if (data.reqData.response && data.reqData.response.statusCode) {
        let statusCode = data.reqData.response.statusCode;
        if (responses[statusCode]) {
          return responses[statusCode](data.reqData.body);
        } else {
          return fallback(data.reqData.body);
        }
      } else {
        return fallback(data.reqData.body);
      }
    }).catch((err) => {
      return fallback(err);
    });
  }

  static createRequestObject(req) {
    return {
      method: req.method,
      url: req.baseUrl + (req.url || ''),
      json: req.body,
      form: req.form,
      headers: req.headers,
      params: req.params,
      qs: req.query,
    };
  }

}

module.exports = RequestService;