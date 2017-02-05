'use strict';

let joiErrors;

exports.getJoiError = function (key, valid){
  return joiErrors[key].message + (valid || '') + '||' + joiErrors[key].code;
};

joiErrors = {
  interviewUserUuid: {
    code: 'KYGCINTERVIEWSCHEMA40001',
    message: 'userUuid is required and must be an string in uuid format'
  },
  interviewLanguage: {
    code: 'KYGCINTERVIEWSCHEMA40002',
    message: 'language is required and must be a string 3-character code'
  },
  interviewStepsmaxtime: {
    code: 'KYGCINTERVIEWSCHEMA40003',
    message: 'steps:maxtime is required and must be a positive number'
  },
  interviewStepsmintime: {
    code: 'KYGCINTERVIEWSCHEMA40004',
    message: 'steps:mintime is required and must be a positive number'
  },
  interviewStepsoverlaytype: {
    code: 'KYGCINTERVIEWSCHEMA40005',
    message: 'steps:overlaytype is required and must be a string'
  },
  interviewStepstype: {
    code: 'KYGCINTERVIEWSCHEMA40006',
    message: 'steps:type is required and must be a string'
  },
  interviewStepssubtitle: {
    code: 'KYGCINTERVIEWSCHEMA40007',
    message: 'steps:subtitle is required and must be a string'
  },
  interviewStepstitle: {
    code: 'KYGCINTERVIEWSCHEMA40008',
    message: 'steps:title is required and must be a string'
  },
  interviewStepswatermarkdatetime: {
    code: 'KYGCINTERVIEWSCHEMA40009',
    message: 'steps:watermarkdatetime is required and must be a boolean'
  },
  interviewStepswatermarkgeo: {
    code: 'KYGCINTERVIEWSCHEMA40010',
    message: 'steps:watermarkgeo is required and must be a boolean'
  },
  interviewStepsorientation: {
    code: 'KYGCINTERVIEWSCHEMA40011',
    message: 'steps:orientation is required and must be a string'
  },
  interviewSteps: {
    code: 'KYGCINTERVIEWSCHEMA40012',
    message: 'steps is required and must be an array of maximum '
  }
};