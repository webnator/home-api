'use strict';

const api_key = 'key-155199c0c16f4d80e3ce4b4d22c5ddc2';
const domain = 'sandbox2ab558b9f3bd4fe4b40c8ef680d34c81.mailgun.org';
const mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

module.exports = {
  send({ to, subject, message, html }) {
    const data = {
      from: 'home@sandbox2ab558b9f3bd4fe4b40c8ef680d34c81.mailgun.org',
      to: to,
      subject: subject,
      text: message,
      html
    };

    return new Promise((resolve, reject) => {
      mailgun.messages().send(data, (err, body) => {
        if (err) {
          return reject(err);
        }
        return resolve(body);
      });
    });
  }
};
