const mqttClient = require('./mqtt')
const screen = require('./screen');
const sonicpi = require('./sonicpi')
const lights = require('./lights')
let topic = 'trinity_led_touch_1/binary_sensor/'; // esp32_touch_pad_gpio27/state



let maps = {
 trinity_led_touch_1: {
    touch0: { 
      name: 'LeftBum',
      chanel: 8,
      on: false,
      light: 'led_30'
    },
    touch2: {
      name: 'Hand',
      chanel: 6,
      on: false,
      light: 'led_2'
    },
  },
  esp_display: {
     touch2: { // 
       name: 'RightBum',
       chanel: 9,
       on: false,
       light: 'led_32'
     },
    touch3: { // 
      name: 'Pussy',
      chanel: 7,
      on: false,
      light: 'led_31'
    },
    touch4: { // 
      name: 'BellyButton',
      chanel: 5,
      on: false,
      light: 'led_1'
    },
    touch6: { // 
      name: 'Lips',
      chanel: 2,
      on: false,
      light: 'led_2'
    },
    touch7: { // 
      name: 'Head',
      chanel: 4,
      on: false,
      light: 'led_1'
    },
    touch8: { // 
      name: 'RightBoop',
      chanel: 1,
      on: false,
      light: 'led_1'
    },
    touch9: { // 
      name: 'LeftBoop',
      chanel: 3,
      on: false,
      light: 'led_2'
    }
  }
}

function topic2chanel(board,topic) {
  return maps[board][topic]
}
let keytimeout
mqttClient.on('message', function (topic, message) {
  // message is Buffer
  let parts = topic.split('/')
  // trinity_led_touch_1/binary_sensor/touch5/state
  if ((parts[0] =='esp_display' || parts[0] == 'trinity_led_touch_1')  && parts[1] == 'binary_sensor') {
    let value = message.toString()
    let sound = topic2chanel(parts[0],parts[2])
    if (sound === undefined) {
      screen.touchlog("Invalid GPIO for topipc: "+ topic + " Parts: " + parts[2])
    } else {
      screen.touchlog("Touch: "+ parts[2] +" Value:"+value+ " Sound:"+JSON.stringify(sound)+" ")
      if (value == 'ON') {

          global.touchactivity = 1
          // play sound
          // screen.log(JSON.stringify(sound))
          sonicpi.play(sound.chanel)
          global.playing[sound.name] = true
          screen.updateTouch("\n"+JSON.stringify(global.playing))
          // light on
          // lights.random(sound.light) - OLD 
          lights.lightRandomWipe(sound.light)
          // global.playing[].parts[2]].on  = true
      } else {
          // stop sounds
          
         global.touchactivity = 0 
          sonicpi.stop(sound.chanel)
          delete global.playing[sound.name]
          screen.updateTouch("\n"+JSON.stringify(global.playing))
          // global.playing.parts[2].on  = false
          // lights stop
          lights.standby(sound.light)
	 // activityCheck(false)
          
      }
    }
    
  }
  
})

module.exports.maps = maps
