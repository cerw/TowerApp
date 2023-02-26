const mqttClient = require('./mqtt')
const screen = require('./screen');
const system = require('./system');

let boards = [
  'esp_display',
 // 'trinity_led_touch_2'
]

let leds = [
  'led_1',
  'led_2',
//  'led_3',
  'led_30',
  'led_31',
  'led_32',
 // 'led_3_b',
//  'led_3_c',
]


function allLightRandom() {
  screen.log("allLightRandom:")
  leds.forEach(led => { 
    lightRandom(led)
  }); 
}

function allLightOn(effect = 'Flicker') {
  screen.log("allLightOn: "+effect)
  leds.forEach(led => { 
    lightOn(effect, led)
  }); 
}

function allLightOff() {
  screen.log("allLightOff: ")
  leds.forEach(led => { 
    lightOff(led)
  }); 
}

function brightness(bright) {
  screen.log("brightness: "+bright)
  leds.forEach(led => { 
    mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"state":"ON","brightness":'+bright+'}'
    )
  }); 
}

function bpm(tick) {
  if(tick == 1) {
   // brightness(50)
  }

  if(tick == 2) {
    //brightness(150)
  }

  if(tick == 3) {
   // brightness(200)
  }

  if(tick == 4) {
   // brightness(90)
  }
}

function allLightStandby() {
  screen.log("allLightStandby: ")
  leds.forEach(led => { 
    standby(led)
  }); 
}


function lightOn(effect,led) {
  screen.log("Ligts on led:"+led)
  if (led === undefined) {
    led =  'led_1'
  }
  if (effect === undefined) {
    effect =  'Scan'
  }
  // red by default
  mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"effect":"'+effect+'","state":"ON","brightness":255,"color": '+randomColor()+'}'
  )
}

function lightOff(led) {
  if (led === undefined) {
    led =  'led_1'
  }
  screen.log("Ligts off led:"+led)
  
  mqttClient.publish('esp_display/light/'+led+'/command', 
  //'{"effect":"Scan","state":"ON","brightness":255,"color":{"r":255,"g":0,"b":0}}'
  // '{"effect":"None","state":"OFF","brightness":255,"color":{"r":255,"g":255,"b":255}}'
  '{"state": "OFF"}'
  )
}

function randomColor() {
  return '{"r": '+randomRgb()+', "g": '+randomRgb()+', "b": '+randomRgb()+'}'
}

function lightRandomWipe(led) {
  //screen.log("Ligts off led:"+led)
  if (led === undefined) {
    led =  'led_1'
  }
  const effects  = ["Flicker","Strobe","Rainbow","FastScan","FastScanLong","Addressable Flicker","RedWipe","GreenWipe","BlueWipe","RedWhiteWipe","GreenWhiteWipe","BlueWhiteWipe"]
  const random = Math.floor(Math.random() * effects.length);
  let effect = effects[random]
  //system.say(effect)
  mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"effect": "'+effect+'","state": "ON","brightness": 230,"color": '+randomColor()+'}'
  )
}

function lightRandom(led) {
  //screen.log("Ligts off led:"+led)
  if (led === undefined) {
    led =  'led_1'
  }
  
  mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"effect": "Flicker","state": "ON","brightness": 250,"color": '+randomColor()+'}'
  )
}


function standby(led = 'led_1') {
  screen.log("Ligts standby led:"+led)
  // red by default
  mqttClient.publish('esp_display/light/'+led+'/command', 
     '{"effect":"FastScan","state":"ON","brightness":150,"color": {"r": 255,"g": 0,"b": 0}}'
    //'{"effect":"FastScan","state":"ON","brightness":200,"color": '+randomColor()+'}'
  )
}

function rainbow() {
  screen.log("Ligts going rainbow")
  let led =  'led_1'
  // red by default
  mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"effect":"Rainbow","state":"ON","brightness":235}'
  )
}

function lightBright(value = 255) {
  
  //if (led === undefined) {
    led =  'led_1'
  //}
  screen.log("lightBright on ligh: "+led+" value: "+value)
  // red by default
  mqttClient.publish('esp_display/light/'+led+'/command', 
    '{"effect": "None","state":"ON","brightness":"'+value+'"}'
  )
}

s = 255
function randomRgb() {
  return Math.round(Math.random()*s);
}



module.exports.standby = standby
module.exports.rainbow = rainbow
module.exports.on = lightOn;
module.exports.off = lightOff;
module.exports.random = lightRandom;
module.exports.lightRandomWipe = lightRandomWipe;
module.exports.lightBright = lightBright;
module.exports.allLightOn = allLightOn;
module.exports.allLightStandby = allLightStandby;
module.exports.allLightRandom = allLightRandom;

module.exports.bpm = bpm

