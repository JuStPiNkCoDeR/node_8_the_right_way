'use strict';
const fs = require('fs');
const zmq = require('zeromq-stable');
const filename = process.argv[2];

// Create the publisher endpoint.
const publisher = zmq.socket('pub');

if (!filename) {
  throw Error('The filename should be specified!');
}

fs.watch(filename, () => {
  // Send a message to any and all subscribers.
  publisher.send(JSON.stringify({
    type: 'changed',
    file: filename,
    timestamp: Date.now()
  }));
});

// Listen on TCP port 60400
publisher.bind('tcp://*:60400', err => {
  if (err) {
    throw err;
  }
  console.log('Listening for zmq subscribers...');
});
