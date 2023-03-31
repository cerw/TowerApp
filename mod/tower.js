const mqtt = require('./mqtt')
const screen = require('./screen');
const sonicpi = require('./sonicpi')
const lights = require('./lights')

let topic = 'trinity_led_touch_1/binary_sensor/'; // esp32_touch_pad_gpio27/state


let keytimeout
mqtt.on('message', function (topic, message) {
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
  }

  if (parts[0] =='speak' ) {
    // let value = message.toString()
    sonicpi.speak(message.toString())
    // screen.log('0'+parts[0])
    // screen.log('2'+parts[2])
  }

  // if (parts[0] =='motion' ) {
  //   // let value = message.toString()
  //   sonicpi.sample(message.toString())
  //   // screen.log('0'+parts[0])
  //   // screen.log('2'+parts[2])
  // }
  
})

function powerOff() {
  mqtt.publish("cmnd/tasmota_01F72B/POWER1", "OFF");
  mqtt.publish("cmnd/tasmota_01F72B/POWER2", "OFF");
  mqtt.publish("cmnd/tasmota_01F72B/POWER3", "OFF");
  mqtt.publish("cmnd/tasmota_01F72B/POWER4", "OFF");
}

function powerOn() {
  mqtt.publish("cmnd/tasmota_01F72B/POWER1", "ON");
  mqtt.publish("cmnd/tasmota_01F72B/POWER2", "ON");
  mqtt.publish("cmnd/tasmota_01F72B/POWER3", "ON");
  mqtt.publish("cmnd/tasmota_01F72B/POWER4", "ON");
}


// network/dhcp

module.exports.powerOn = powerOn
module.exports.powerOff = powerOff
