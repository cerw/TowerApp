#!/usr/bin/node
// Power Brain App v2.0
// OSC Bridge
// MQTT Bridge
// WebSocket for web
// const config = require('./mod/config')

global.alive = 0
global.motion = 0
global.lightactivity = 0
global.keyactivity = 0
global.webactivity = 0
global.touchactivity = 0
global.beat = 0

global.playing = {}



global.wifi = 0
global.uptime = 0



const mqtt = require('./mod/mqtt')
const sonicpi = require('./mod/sonicpi')
const screen = require('./mod/screen')
const system = require('./mod/system')
const lights = require('./mod/lights')
// const touch = require('./mod/touch')
const socket = require('./mod/socket')


// Render the screen.
screen.screen.render()

screen.screen.on('keypress', function (key) {
  global.keyactivity = 1
  activityCheck(false)
  clearTimeout(keytimeout)
  keytimeout = setTimeout(function () {
    global.keyactivity = 0
    screen.updateStatus(activityStatus())
    screen.log('Killing keys after 10s inactivity')
  }, 10000)
  screen.updateStatus(activityStatus())
})

// Bind to OSC
sonicpi.bind()

// State
let keytimeout

//updateSystem


//
function activityStatus () {
  return  "\n" +
  'Motion: ' + global.motion 
  + ' Touch:' + global.touchactivity 
  + ' Keys:' + global.keyactivity 
  + ' Alive:' + global.alive 
  + ' Lights: ' + global.lightactivity
}

// Alive or dead?
function activityCheck (rerun = true) {
  screen.log('Actitivy check')
  if ((global.motion || global.touchactivity || global.keyactivity) && !global.alive) {
    // recent motion
    global.alive = 1
    // log('Alive check')
    screen.log('We become alive 👍🏻')
    //system.say('Welcome Human, come play with me')
    system.welcome()
    
  }
  
  // totaly dead
  if (!global.motion && !global.touchactivity && !global.keyactivity && global.alive) {
    // motion is off
    global.alive = 0
    screen.log('We are dead 🤢')
    system.say('Going stand by..')
    lights.allLightStandby()
    // movie sample
    sonicpi.play(300)
    // aroma
    sonicpi.play(200)
  }
  screen.updateStatus(activityStatus())
  mqtt.publish('app/beat', 'app alive '+Date.now())
  //console.debug("redraw ",activityStatus())
  if(rerun) {
    setTimeout(activityCheck, 5000) // run every 10s
  }
}

// MOTION
mqtt.on('message', function (topic, message) {
  // message is Buffer
  if (topic === 'motion') {
    const json = JSON.parse(message.toString())
    if (json.e === 'motion') {
      //sonicpi.motion()
    //   let max = 200000
    //   let point = max / 100
    //   let amp = json.pixel / max
    //   if(amp > 0.1) {
    // //    sonicpi.motion(amp)
    //   }
      
      global.motion = 1
      
      if (!global.alive) {
        // we dead bring it back to live
        activityCheck(false)
        screen.mqttlog('Motin started', json)
      }
    }

    if (json.e === 'end') {
      global.motion = 0
      activityCheck(false)
      screen.mqttlog('Motind ended', json)
    }
  } else if(topic == 'esp_display/status') {
      // TODO only if they  from off -> online . track it.
       screen.log("Lights become "+message.toString())
       system.say('Lights are '+message.toString())
       global.lightactivity = 1
       screen.updateStatus(activityStatus())
  } else if(topic == 'esp_display/sensor/touch_esp_wifi_signal/state') {  
      global.wifi = message.toString()
      screen.updateSystem(screen.systemStatus())
  } else if(topic == 'esp_display/sensor/touch_esp_wifi_signal/state') {  
      global.uptime = message.toString()
      screen.updateSystem(screen.systemStatus())
  } else {
      screen.mqttlog(topic, message.toString())
  }
 

})

lights.allLightRandom()
system.say('Tower Brain Started')
sonicpi.play(100)
sonicpi.play(200)
activityCheck(true)
screen.updateStatus(activityStatus())
screen.updateSystem(screen.systemStatus())
