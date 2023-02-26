// config.js
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  mqtt_server: process.env.MQTT_SERVER,
  sonic_pi_host: process.env.SONIC_PI_HOST,
  sonic_pi_port: process.env.SONIC_PI_PORT,
  osc_port: process.env.OSC_PORT,
  websocket_port: process.env.SOCKET_PORT
};