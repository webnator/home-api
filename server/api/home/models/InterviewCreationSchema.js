'use strict';

const Joi     = require('joi');
const joiVals = require('./JoiValidations');
const config = require('./../../../config/environment');

function InterviewCreationSchema() {
  return Joi.object().keys({
    userUuid: Joi.string().guid().required().label(joiVals.getJoiError('interviewUserUuid')),
    language: Joi.string().max(3).min(3).label(joiVals.getJoiError('interviewLanguage')),
    steps: Joi.array().items(
      Joi.object().keys({
        maxtime: Joi.number().positive().required().label(joiVals.getJoiError('interviewStepsmaxtime')),
        mintime: Joi.number().positive().required().label(joiVals.getJoiError('interviewStepsmintime')),
        overlaytype: Joi.string().required().label(joiVals.getJoiError('interviewStepsoverlaytype')),
        type: Joi.string().required().label(joiVals.getJoiError('interviewStepstype')),
        subtitle: Joi.string().required().label(joiVals.getJoiError('interviewStepssubtitle')),
        title: Joi.string().required().label(joiVals.getJoiError('interviewStepstitle')),
        watermarkdatetime: Joi.boolean().required().label(joiVals.getJoiError('interviewStepswatermarkdatetime')),
        watermarkgeo: Joi.boolean().required().label(joiVals.getJoiError('interviewStepswatermarkgeo')),
        orientation: Joi.string().required().label(joiVals.getJoiError('interviewStepsorientation'))
      })
    ).max(config.maxSteps).required().label(joiVals.getJoiError('interviewSteps', config.maxSteps))
  }).required();
}
module.exports = InterviewCreationSchema;
