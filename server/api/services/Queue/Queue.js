'use strict';

let mqtt = require('async-mqtt');
let config = require('./../../../config/environment/index');

class Queue {
  constructor() {
    this.client = null;
    this._consumers = {};
  }

  connect() {
    return new Promise((resolve) => {
      this.client = mqtt.connect('mqtt://' + config.queueConfig.host + ':' + config.queueConfig.port, {
        username: config.queueConfig.user,
        password: config.queueConfig.password
      });
      this.client.on('connect', () => {
        console.log('info', 'Queue connect - OK');
        this.setHandler();
        return resolve();
      });
      this.client.on('error', (err) => {
        console.log('error', 'Queue connect - Error', err);
      });
      this.client.on('reconnect', () => {
        console.log('error', 'Queue connect - Reconnect');
      });
      this.client.on('close', () => {
        console.log('error', 'Queue connect - Close');
      });
      this.client.on('offline', () => {
        console.log('error', 'Queue connect - Offline');
      });
    });
  }

  consume(topic, callback) {
    this._consumers[topic] = callback;
    this.client.subscribe(topic);
  }

  setHandler() {
    this.client.on('message', (topic, message) => {
      if (this._consumers[topic]) {
        let stringMessage = { payload: JSON.parse(message.toString()) };
        this._consumers[topic](JSON.stringify(stringMessage));
      } else {
        console.log('Unhandled message:', message.toString(), 'in topic', topic);
      }
    });
  }

  async publishAndWaitResponse({subscribeTopic, publishTopic, payload, callback}) {
    await this.client.subscribe(subscribeTopic);
    await this.client.publish(publishTopic, payload);


    return this.client.on('message', (topic, message) => {
      if (topic === subscribeTopic) {
        this.client.unsubscribe(subscribeTopic);
        return callback(message);
      }
    });
  }


  // publish(key, msg) {
  //   this.channel.assertExchange(config.queueConfig.exchange, 'topic', {durable: true});
  //   this.channel.assertQueue(key).then((res) => {
  //     this.channel.bindQueue(res.queue, config.queueConfig.exchange, key);
  //     return this.channel.publish(
  //       config.queueConfig.exchange,
  //       key,
  //       new Buffer(JSON.stringify(msg)), {persistent: true});
  //   });
  // }
  //
  // static _createHTTPRequest(payload, headers, query, params) {
  //   return {
  //     headers: headers || {},
  //     payload: payload || {},
  //     query: query || {},
  //     params: params || {}
  //   };
  // }
  //
  // publishHTTPRequest(key, payload, headers, query, params) {
  //   let msg = Queue._createHTTPRequest(payload, headers, query, params);
  //   return this.publish(key, msg);
  // }
  //
  // publishToErrorQueue(msg, responseData) {
  //   msg.response = responseData;
  //   this.channel.assertQueue(config.queueConfig.errorQueue).then((res) => {
  //     this.channel.bindQueue(res.queue, config.queueConfig.exchange, config.queueConfig.errorTopic);
  //     return this.publish(config.queueConfig.errorTopic, msg);
  //   });
  //
  // }

}

module.exports = Queue;
