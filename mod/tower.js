const mqttClient = require('./mqtt')
const screen = require('./screen');
const sonicpi = require('./sonicpi')
const lights = require('./lights')
let topic = 'trinity_led_touch_1/binary_sensor/'; // esp32_touch_pad_gpio27/state


let keytimeout
mqttClient.on('message', function (topic, message) {
  // message is Buffer
  let parts = topic.split('/')
  // trinity_led_touch_1/binary_sensor/touch5/state
  // screen.log(message)
  // screen.log(topic)
  if (parts[0] =='play' ) {
    // let value = message.toString()
    sonicpi.sample(message.toString())
    // screen.log('0'+parts[0])
    // screen.log('2'+parts[2])
//    screen.touchlog("Invalid GPIO for topipc: "+ topic + " Parts: " + parts[2])
  
  }
  
})

// module.exports.maps = maps
