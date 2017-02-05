'use strict';

let QueueManager = require('./QueueManager');

class QueueService {
  static start() {
    new QueueManager();
  }
}

module.exports = QueueService;
