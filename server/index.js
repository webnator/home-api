'use strict';

const app = require('./app.js');
const Queue = require('./api/services/Queue/QueueService');

app.init().then(function(server) {
  console.log('Server running at', server.info.uri);
  Queue.start();
}, function(err) {
  console.log('Server start error',  err);
});
