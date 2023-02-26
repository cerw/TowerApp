var mqtt = require('mqtt')
const config = require('./config')
var mqttClient  = mqtt.connect(config.mqtt_server
    // {
    // 'username': 'nano',
    // 'password': 'n4n0'
    // }
  )
   
  mqttClient.on('connect', function () {
    mqttClient.subscribe('#', function (err) {
      if (!err) {
        mqttClient.publish('presence', 'Power Brain App is connected')
      }
    })
  })
  
module.exports = mqttClient

  