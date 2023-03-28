// config.js
const config = require('./config')
var osc = require('osc-min')
var dgram = require('dgram')
const screen = require('./screen')
const system = require('./system')
const lights = require('./lights')

let tick = 0;

screen.log('Sonic Host: '+config.sonic_pi_host+' Port:'+ config.sonic_pi_port);
// listen for OSC messages and print them to the console
var udp = dgram.createSocket('udp4', function(msg, rinfo) {
  // save the remote address
  remote = rinfo.address;
  //  log(osc.fromBuffer(msg));
  message = osc.fromBuffer(msg)
  //var value = message.args[0].value;
  var address = message.address;
  var match = address.match(/^\/rgb\/(.*)/);
  
  if(address == '/sonic/boom') {
    
    tick++;
    
    screen.beat()
    //console.debug("Sonic beat")
    global.beat  = tick
    lights.bpm(tick)
    if(tick === 4) tick = 0;
    //lights.lightBright(Math.floor(Math.random() * 255) + 1)
    //screen.osclog("Incomding beat osc: "+address);
    
  } else if(address == '/sonic/start') {
    screen.log("Sonic PI Trinity Executed")
    system.say("Sonic PI Started")
  } else {
    screen.osclog("Incomding osc: "+address);
  }
  // resend to QLC + Sound
  //ocsResend(message)
});

function bind () {
  udp.bind(parseInt(config.osc_port));
  screen.log('OSC Listening on UDP port: '+config.osc_port);
}


function sonicSend(message) {
  var request = osc.toBuffer(message);
  udp.send(request, 0, request.length, config.sonic_pi_port, config.sonic_pi_host);
  screen.osclog('OSC to Sonic: '+JSON.stringify(message));
  //ocsResend(message)
//  udp.send(request, 0, request.length, touchPort, touchHost);
//  log('Sent Feedback OSC message to TouchOSC '+touchHost+':'+touchPort);
}
function play(channel) {
  //screen.log("SonicPI Play Channel : "+channel)
  sonicSend({
    address: "/sound/"+channel,
    args: {
      type: 'float',
      value: 1
    }
  })
}

function sample(filename) {
	// const { exec } = require("child_process")
  //screen.log("SonicPI Play Channel : "+channel)
   //exec('aplay  "'+filename+'"')
   
   sonicSend({
    address: "/play",
    args: {
      type: 'string',
      value: filename
    }
  })
}



function tone(filename) {
  //screen.log("SonicPI Play Channel : "+channel)
  sonicSend({
    address: "/tone",
    args: {
      type: 'string',
      value: filename
    }
  })
}

function motion(value) {
  //screen.log("SonicPI Monoti Channel : "+value)
  sonicSend({
    address: "/tone",
    args: {
      type: 'float',
      value: value * 10
    }
  })
}

function movie(value) {
  //screen.log("SonicPI Monoti Channel : "+value)
  sonicSend({
    address: "/movie",
    args: {
      type: 'float',
      value: value * 10
    }
  })
}



function stop(channel) {
  //screen.log("SonicPI Stop Channel : "+channel)
  sonicSend({
    address: "/sound/"+channel,
    args: {
      type: 'float',
      value: 0
    }
  })
}

function siren()
{
  sonicSend({
    address: "/siren",
    args: {
      type: 'float',
      value: 0
    }
  })
}

function random(channel) {
  //screen.log("SonicPI Stop Channel : "+channel)
  sonicSend({
    address: "/random",
    args: {
      type: 'float',
      value: 0
    }
  })
}


module.exports.bind = bind
module.exports.stop = stop
module.exports.play = play
module.exports.motion = motion
module.exports.sample = sample
module.exports.tone = tone
module.exports.random = random
module.exports.movie = movie
module.exports.siren = siren



