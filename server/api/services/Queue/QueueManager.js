'use strict';

//let config = require('./../../../config/environment/index');
let QueueRouter = require('./QueueRouter');
let Queue = require('./Queue');

class QueueManager {
  constructor() {
    // Sets up a new instance of the router
    this.router = new QueueRouter();
    // Sets the registered routes
    require('./../../../queueRoutes')(this.router);

    // Sets up a new queue instance
    this.queue = new Queue();
    this.queue.connect().then(() => {
      this._setConnectionErrorProcedure();
      this._consumeQueue();
    });
  }

  _setConnectionErrorProcedure() {
    this.queue.client.on('error', (err) => {
      console.log('', 'QueueManager Conn error Retrying - Error: ', err);
      this.queue.connect().then(() => {
        this._consumeQueue();
      });
    });
  }

  _consumeQueue() {
    let routes = this.router.getRoutes();
    for (let i = 0; i < routes.length; i++) {
      let route = routes[i];

      this.queue.consume(route.topic, (message) => {
        let msgRequest;
        try {
          msgRequest = JSON.parse(message.toString());
          if (!msgRequest.headers) {
            msgRequest.headers = {};
          }
          msgRequest.method = 'QUEUE';
          msgRequest.path = route.topic;
        } catch(err) {
          msgRequest = message.toString();
        }

        let bindObject = {
          message: message,
          queue: this.queue
        };

        route.handler(msgRequest, QueueManager._replyFunction.bind(bindObject));
      });
    }
  }

  static _replyFunction(data) {
    return {
      code: (status) => {
        console.log('Process finished with', status, data);
        // switch(status) {
        //   case 200:
        //   case 201:
        //   case 202:
        //   case 204:
        //     this.queue.channel.ack(this.message);
        //     break;
        //   case 400:
        //     console.log('A request error. Send to error queue');
        //     this.queue.publishToErrorQueue(JSON.parse(this.message.content.toString()), data);
        //     this.queue.ack(this.message);
        //     break;
        //   case 500:
        //     let content = JSON.parse(this.message.content.toString());
        //     if (content.headers && content.headers['X-TimesResent'] !== undefined && !isNaN(parseInt(content.headers['X-TimesResent']))) {
        //       content.headers['X-TimesResent']++;
        //     } else {
        //       content.headers = content.headers || {};
        //       content.headers['X-TimesResent'] = 0;
        //     }
        //
        //     this.queue.ack(this.message);
        //     if (content.headers['X-TimesResent'] > config.queueConfig.maxRetries) {
        //       console.log('A request error. Send to error queue');
        //       this.queue.publishToErrorQueue(content, data);
        //     } else {
        //       this.queue.publish(this.message.fields.routingKey, content);
        //     }
        //     break;
        //   default:
        //     console.log('A request error. Send to error queue');
        //     this.queue.publishToErrorQueue(JSON.parse(this.message.content.toString()), data);
        //     this.queue.ack(this.message);
        //     break;
        // }
      }
    };
  }
}

module.exports = QueueManager;
