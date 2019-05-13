const bunyan = require('bunyan');

const log = bunyan.createLogger({
  name: 'brocker-script',
  level: 'info',
  streams: [
    {
      level: 'debug',
      stream: process.stdout // log INFO and above to stdout
    },
    {
      level: 'error',
      path: __dirname + '/../logs/error.log' // log ERROR and above to a file
    }
  ],
  // src: true
});

log.info('Logger initialized');

module.exports = log;
