const lights = require('./lights');
const screen = require('./screen');
const sonicpi = require('./sonicpi')

function say(text) {
  const { exec } = require("child_process")
  // voice 
  // espeak -gine ven-us+f5 -s130
  // let text="Trinity Engined started."
  if(process.platform == 'darwin')  {
      exec('say "'+text+'"')
  } else {
      exec('espeak -ven-us+f5 -s130 "'+text+'"')
  }
}

function welcome() {
  screen.log('Welcome 👋🏼')
  say('Hello human')
  // play melodic sound
  sonicpi.play(200)
  //lights.allLightStandby()
  lights.allLightOn('RedWhiteWipe')
}


//module.exports.activityStatus = activityStatus;
module.exports.say = say;
module.exports.welcome = welcome;
