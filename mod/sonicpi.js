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

function motion(value) {
  //screen.log("SonicPI Monoti Channel : "+value)
  sonicSend({
    address: "/motion",
    args: {
      type: 'float',
      value: value
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


module.exports.bind = bind
module.exports.stop = stop
module.exports.play = play
module.exports.motion = motion

