const config = require('config');
const { sourceTopic, sourceClientId } = config;
const MQTTClient = require('./mqtt-client.js');
const log = require('./logger.js');

const client = new MQTTClient({
  host: config.mqtt.host
}).connect();

client.on('connect', async () => {
  try {
    await client.subscribe(sourceTopic, { qos: 1 });

    client.on('message', (topic, message, packet) => {
      if (topic !== sourceTopic) {
        throw new Error(`Unexpected message from topic ${topic}`);
      }
      let data;
      try {
        data = JSON.parse(message.toString());
      } catch(e) {
        log.warn('Error parsing message');
        log.error(e);
        client.end().then(() => {
          process.exit(2);
        });
      }

      if (!data.meter || data.meter !== sourceClientId) {
        log.warn('unsupported message was ignored');
        return;
      }

      // log.info('Message: ', data);

      for (let num in data) {
        if(Number.isInteger(+num)) {
          log.info('Publishing: %d -> %d', num, data[num]);
          client.publish(`V${num}`, data[num], { retain: true });
        }
      }
    });
  } catch (e){
    log.error(e);
    process.exit(100);
  }
});
