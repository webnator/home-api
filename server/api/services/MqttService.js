'use strict';

var mqtt = require('async-mqtt');
var config = require('./../../config/environment').queueConfig;

class MQTTService {
  constructor() {
    this.client = mqtt.connect('mqtt://' + config.host + ':' + config.port, {
      username: config.user,
      password: config.password
    });
  }

  async publishAndWaitResponse({subscribeTopic, publishTopic, payload, callback}) {
    await this.client.subscribe(subscribeTopic);
    await this.client.publish(publishTopic, payload);


    return this.client.on('message', (topic, message) => {
      if (topic === subscribeTopic) {
        this.client.unsubscribe(subscribeTopic);
        return callback(message.toString());
      }
    });
  }

  publishToTopic(topic, payload) {
    return this.client.publish(topic, payload);
  }



  // handleMessage(topic, message) {
  //   if (this.topics.has(topic)) {
  //     this.callbacks[topic](message);
  //   }
  // }
  //
  // registerTopic(topic, callback) {
  //   this.client.subscribe(topic);
  //   this.topics.add(topic);
  //   this.callbacks[topic] = callback;
  // }
}

module.exports = new MQTTService();

