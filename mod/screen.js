const blessed = require('blessed')
const sonicpi = require('./sonicpi')
const system = require('./system')
const mqttClient = require('./mqtt')
const lights = require('./lights')
const moment = require('moment');
let format = 'D MMM HH:mm:ss';

// Create a screen object.
var screen = blessed.screen({
  smartCSR: true,
  fullUnicode: true,
  dockBorders: true,
  ignoreDockContrast: true
});

screen.title = 'Trinity V2.0';

var logbox = blessed.box({
  parent: screen,
  label: '{bold}{cyan-fg}Debug{/cyan-fg}{/bold}',
  left: 0,
  top: 0,
  height: '25%',
  tags: true,
  border: {
    type: 'line'
  }
});

screen.append(logbox);


var motionText = blessed.box({
  parent: screen,
  border: {
    type: 'line'
  },
  tags: true,
  left: 0,
  top: '75%',
  height: '10%',
  width: '50%',
  shrink: true,
  label: '{bold}{cyan-fg}Status Indicator{/cyan-fg}{/bold}',
  name: 'Motion',
  content: 'Motion',
});


var systemText = blessed.box({
  parent: screen,
  border: {
    type: 'line'
  },
  tags: true,
  left: 0,
  top: '85%',
  height: '10%',
  width: '50%',
  shrink: true,
  label: '{bold}{cyan-fg}System Status{/cyan-fg}{/bold}',
  name: 'Motion',
  content: 'Motion',
});

//

var bpm_button = blessed.box({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: '25%',
  top: '50%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'BPM',
  content: 'BPM',
  style: {
    bg: 'yellow',
    fg: 'black',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

//
var stop_sound_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: 0,
  top: '50%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'Stop Sound',
  content: 'Stop Sound',
  style: {
    bg: 'red',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

stop_sound_button.on('press', function() {
  sonicpi.play(100)
});

var movies_sound_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: 0,
  top: '55%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'Tone Sound',
  content: 'Tone Sound',
  style: {
    bg: 'green',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

movies_sound_button.on('press', function() {
  sonicpi.tone('C')
});


//
var a_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: '25%',
  top: '55%',
  height: '5%',
  width: '5%',
  shrink: true,
  name: 'Power A',
  content: 'Power A',
  style: {
    bg: 'black',
    fg: 'yellow',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

a_button.on('press', function() {
  
  // is ON 
  if(global.power_a) {
    // go OFF
    b_button.style.bg = 'red' 
    mqttClient.publish('cmnd/tasmota_01F72B/POWER1', 'OFF')
    global.power_a = false
  } else {
    b_button.style.bg = 'green' 
    mqttClient.publish('cmnd/tasmota_01F72B/POWER1', 'ON')
    global.power_a = true
  }
  
  
});


var b_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: '30%',
  top: '55%',
  height: '5%',
  width: '5%',
  shrink: true,
  name: 'Power B',
  content: 'Power B',
  style: {
    bg: 'black',
    fg: 'yellow',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

b_button.on('press', function() {
  // is ON 
  if(global.power_b) {
    // go OFF
    b_button.style.bg = 'red' 
    mqttClient.publish('cmnd/tasmota_01F72B/POWER2', 'OFF')
    global.power_b = false
  } else {
    b_button.style.bg = 'green' 
    mqttClient.publish('cmnd/tasmota_01F72B/POWER2', 'ON')
    global.power_b = true
  }
  
  
});


//

var atmos_sound_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: 0,
  top: '60%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'Random Sound',
  content: 'Ranom Sound',
  style: {
    bg: 'yellow',
    fg: 'black',
    // focus: {
    //   bg: 'red'
    // },
    hover: {
      bg: 'black'
    }
  }
});

atmos_sound_button.on('press', function() {
  sonicpi.random( )
});


var lights_on_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: 0,
  top: '65%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'Lights Off',
  content: 'Lights Off',
  style: {
    bg: 'black',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

lights_on_button.on('press', function() {
  lights.allLightOff()
});

var lights_off_button = blessed.button({
  parent: screen,
  mouse: true,
  keys: true,
  shrink: true,
  left: 0,
  top: '70%',
  height: '5%',
  width: '25%',
  shrink: true,
  name: 'Lights standby',
  content: 'Lights standby',
  style: {
    bg: 'white',
    focus: {
      bg: 'red'
    },
    hover: {
      bg: 'black'
    }
  }
});

lights_off_button.on('press', function() {
//  lights.standby('led_1')
  lights.allLightStandby()
  
});



// listen and port box// Create a box perfectly centered horizontally and vertically.
var netbox = blessed.box({
  parent: screen,
  label: '{bold}{cyan-fg}Touch Log{/cyan-fg}{/bold}',
  left: '0',
  top: '25%',
  height: '25%',
  width: '50%',
  tags: true,
  border: {
    type: 'line'
  }
});



// listen and port box// Create a box perfectly centered horizontally and vertically.
var mqttbox = blessed.box({
  parent: screen,
  label: '{bold}{cyan-fg}MQTT Log{/cyan-fg}{/bold}',
  left: '50%',
  top: '25%',
  height: '25%',
  width: '50%',
  tags: true,
  border: {
    type: 'line'
  }
});

screen.append(mqttbox);


var oscbox = blessed.box({
  parent: screen,
  label: '{bold}{cyan-fg}OSC Log{/cyan-fg}{/bold}',
  left: '50%',
  top: '50%',
  // scrollable: true,
  // alwaysScroll: true,
  height: '25%',
  width: '50%',
  tags: true,
  border: {
    type: 'line'
  }
});

screen.append(oscbox);


// status

var touchBox = blessed.box({
  parent: screen,
  label: '{bold}{cyan-fg}Touch Status{/cyan-fg}{/bold}',
  left: '50%',
  top: '75%',
  height: '25%',
  width: '50%',
  tags: true,
  border: {
    type: 'line'
  }
});

screen.append(touchBox);



// Focus our element.
logbox.focus();


// Helpers
function log(text) {
  logbox.insertTop('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+text+'{/green-fg}');
  screen.render();
}

function weblog(text) {
  webbox.insertTop('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+text+'{/green-fg}');
  screen.render();
}

function touchlog(text) {
  netbox.insertTop('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+text+'{/green-fg}');
  screen.render();
}



function osclog(text) {
  oscbox.insertTop('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+text+'{/green-fg}');
  screen.render();
}

function mqttlog(topic, body) {
  mqttbox.insertTop('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+topic+'{/green-fg}');
  mqttbox.insertTop('{grey-fg}'+body+'{/green-fg}');
  
 screen.render();
}

function updateStatus(content) {
  motionText.setContent('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+content+'{/green-fg}');
}

function updateSystem(content) {
  systemText.setContent('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+content+'{/green-fg}');
}




function updateTouch(content) {
  touchBox.setContent('{red-fg}'+moment().format(format)+'{/red-fg} {green-fg}'+content+'{/green-fg}');
}



function systemStatus () {
  let string = "\n" + 
  '📶 ' + global.wifi+ ' ⏲️ ' + global.uptime +' BPM: ' + global.beat + "\n"
  return string
}


function beat() {
  //console.log(bpm_button)
  if (bpm_button.style.bg == 'red') {
    bpm_button.style.bg = 'black' 
  } else {
    bpm_button.style.bg = 'red' 
  }  
  updateSystem(systemStatus())
  screen.render();
}

// Quit on Escape, q, or Control-C.
screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  
  // light_off()
  // lights_effect()
  sonicpi.play(100)
  system.say("Good buy..")
  return process.exit(0);
});





module.exports.screen = screen
module.exports.log = log
module.exports.touchlog = touchlog
module.exports.weblog = weblog
module.exports.osclog = osclog
module.exports.mqttlog = mqttlog
module.exports.beat = beat
module.exports.updateStatus = updateStatus
module.exports.updateTouch = updateTouch
module.exports.updateSystem = updateSystem
module.exports.systemStatus = systemStatus









