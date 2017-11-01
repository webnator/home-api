'use strict';

const Joi     = require('joi');
const joiVals = require('./JoiValidations');
const config = require('./../../../config/environment');

function LightsStateSchema() {
  const allowedLights = config.lights.map(l => l.id);
  const allowedState = ['ON', 'OFF'];
  return Joi.object().keys({
    power: Joi.string().uppercase().valid(allowedState).label(joiVals.getJoiError('lightState_power', allowedState)),
    lightId: Joi.string().valid(allowedLights).label(joiVals.getJoiError('lightState_lightId', allowedLights))
  }).required();
}
module.exports = LightsStateSchema;
