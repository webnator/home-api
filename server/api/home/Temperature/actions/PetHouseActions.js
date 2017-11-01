'use strict';

const config = require('./../../../../config/environment');
const mqttService = require('./../../../services/MqttService');
const emailService = require('./../../../services/MailService');

class PetHouseAction {
  constructor({temperature, logData}) {
    this.temperature = temperature;
    this.logData = logData;

    this.tempConfig = config.temperature.pet_house.indicators;
    this.petHouseLamp = config.temperature.pet_house.topic;
    this.notifyMails = config.temperature.pet_house.notify;
  }

  async execute() {
    if (this.temperature.temperature <= this.tempConfig.min) {
      mqttService.publishToTopic(this.petHouseLamp, 'ON');
    } else if (this.temperature.temperature >= this.tempConfig.max) {
      mqttService.publishToTopic(this.petHouseLamp, 'OFF');
    }

    if (this.temperature.temperature <= this.tempConfig.critical) {
      const mailMsg = 'The temperature in the pet house is: ' + this.temperature.temperature + ' \n Do something!!!!';
      await emailService.send({to: this.notifyMails, message: mailMsg, subject: 'Pets are cold!'});
    }
  }

}

module.exports = PetHouseAction;
