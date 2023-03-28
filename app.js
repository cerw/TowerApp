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

global.power_a = false
global.power_b = false
global.power_c = false
global.power_d = false

global.wifi = 0
global.uptime = 0



const mqtt = require('./mod/mqtt')
const sonicpi = require('./mod/sonicpi')
const screen = require('./mod/screen')
const system = require('./mod/system')
const lights = require('./mod/lights')
// const touch = require('./mod/touch')
const tower = require('./mod/tower')
const socket = require('./mod/socket')
const mqttClient = require('./mod/mqtt')


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
    // TOOD
    lights.allLightStandby()
    // movie sample
	  // sonicpi.play(300)
    // aroma
	  //sonicpi.play(200)

    mqttClient.publish("cmnd/tasmota_01F72B/POWER1", "OFF");
    mqttClient.publish("cmnd/tasmota_01F72B/POWER2", "OFF");
    mqttClient.publish("cmnd/tasmota_01F72B/POWER3", "OFF");
    mqttClient.publish("cmnd/tasmota_01F72B/POWER4", "OFF");
  }
  screen.updateStatus(activityStatus())
  // TODO
  // mqtt.publish('app/beat', 'app alive '+Date.now())
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
      let max = 200000
      let point = max / 100
      let amp = json.pixel / max
      if(amp > 0.1) {
      // sonicpi.motion(amp)  
      }
  
      global.motion = 1
      
      if (!global.alive) {
        // we dead bring it back to live
        activityCheck(false)
        system.say('Motion is on')
        screen.mqttlog('Motin started', json)
      }
    }

    if (json.e === 'end') {
      global.motion = 0
      activityCheck(false)
      system.say('Motion is off')
      screen.mqttlog('Motind ended', json)
    }
  } else if(topic == 'wled/a/status' || topic == 'wled/c/status') {
      // TODO only if they  from off -> online . track it.
       screen.log("Lights become "+message.toString())
       system.say('Lights are '+message.toString())
       global.lightactivity = 1
       screen.updateStatus(activityStatus())
  } else if(topic == 'turtlecar/status') {  
      screen.log("turtlecar become "+message.toString())
      system.say('Turtle is '+message.toString())
      // global.wifi = message.toString()
	
      // screen.updateSystem(screen.systemStatus())
      if(message.toString() == 'online') {
      sonicpi.sample("/srv/coco.wav")
      } else {
	 system.say('Turtle is leaving us, till next time')     
      }
  } else if(topic == 'tele/tasmota_01F72B/LWT') { 
      screen.log("PowerSwitch become "+message.toString()) 
      system.say('PowerSwitch is '+message.toString())
  } else if(topic == 'network/dhcp') {
     system.say('We got another one')
  } else {
    //  screen.mqttlog(topic, message.toString())
  }
 

})

// lights.allLightRandom()
system.say('Tower Brain Started')
sonicpi.play(100)
sonicpi.play(200)
activityCheck(true)
screen.updateStatus(activityStatus())
screen.updateSystem(screen.systemStatus())
