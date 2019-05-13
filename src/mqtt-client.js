const MQTT = require('async-mqtt');
const log = require('./logger.js');


class MqttClient {

  constructor({ host, ...options }) {
    this.client = null;
    this.host = host;
    this.clientOptions = options || {};
  }

  connect() {
    if (this.client && this.client.connected) return;

    const client = MQTT.connect(this.host, this.clientOptions);

    // Error calback
    client.on('error', (err) => {
      log.error('Can\'t connect', err);
      client.end().then(() => {
        process.exit(1);
      });
    });

    // Connection callback
    client.on('connect', () => {
      log.info(`mqtt client connected to ${this.host}`);
    });

    client.on('close', () => {
      log.warn(`mqtt client disconnected`);
    });

    process.on('SIGINT', async () => {
      log.warn('Stop signal');
      await client.end();
      process.exit(0);
    });

    return this.client = client;
  }
}

module.exports = MqttClient;
