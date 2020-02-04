const EventEmitter = require('events').EventEmitter;
class LdjClient extends EventEmitter {
  constructor(stream) {
    super();
    if (stream) {
      let buffer = '';
      stream.on('data', data => {
        buffer += data;
        let boundary = buffer.indexOf('\n');
        while (boundary !== - 1) {
          const input = buffer.substring(0, boundary);
          buffer = buffer.substring(boundary + 1);
          this.emit('message', JSON.parse(input));
          boundary = buffer.indexOf('\n');
        }
      });
    } else {
      this.emit('error', new Error('Stream required!'));
    }
  }

  static connect(stream) {
    return new LdjClient(stream);
  }
}

module.exports = LdjClient;
