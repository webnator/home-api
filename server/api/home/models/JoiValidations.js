'use strict';

let joiErrors;

exports.getJoiError = function (key, valid){
  return joiErrors[key].message + (valid || '') + '||' + joiErrors[key].code;
};

joiErrors = {
  lightState_power: {
    code: 'HOME40001',
    message: 'power is required and must be one of tbese values: '
  },
  lightState_lightId: {
    code: 'HOME40002',
    message: 'lightId is required and must be one of tbese values: '
  },
};