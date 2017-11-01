'use strict';

function TemperatureResponseModel(temperatures) {
  let response = [];

  temperatures.forEach((temperature) => {
    response.push({
      storedTime: temperature.storedTime,
      humidity: temperature.humidity,
      temperature: temperature.temperature
    })
  });

  return response;
}

module.exports = TemperatureResponseModel;
