'use strict';

let ACTIONS = {
  pet_house: require('./PetHouseActions.js')
};

module.exports = {
  getAction(action) {
    return ACTIONS[action];
  }
};
