const express = require('express')
const config = require('./config')
const screen = require('./screen');
const touch = require('./touch');
const sonicpi = require('./sonicpi')
const lights = require('./lights');
const e = require('express');

// web backed for color picker
var app = express();
app.use(express.static('static'))
app.listen(8000);


server  = require("http").createServer({
                //cert:fs.readFileSync('/Users/cerw/.valet/Certificates/leap.dev.crt'),
                //key: fs.readFileSync('/Users/cerw/.valet/Certificates/leap.dev.key')
            },app)


const io = require("socket.io")(server)


function key2chanel(key) {
  let number = parseInt(key)
  screen.log(number)
  screen.log(JSON.stringify(touch.maps['esp_display']))
  if  (number >= 1 && number <= 8) {
    return touch.maps['esp_display']['touch'+number]
  }
  if  (number >= 9 && number <= 11) {
    return touch.maps['trinity_led_touch_1']['touch'+number]
  }
  
  //return touch.maps['esp_display']['touch3']
}

screen.log(JSON.stringify(touch.maps))



io.on('connection', function (socket) {


  screen.log("WebBrowser Connected")

  io.on('disconnect', function () {
    io.emit('user disconnected');
    weblog("WebBrowser disconnect")
  });

  socket.on("keydown", function(data) {
    // ON
    global.webactivity = 1
    let sound = key2chanel(data.key)
    if(sound === undefined) {
      screen.touchlog("Bad KeyDown: "+ data.key)
    } else {
      screen.touchlog("Key: "+ data.key +" Value: DOWN Sound:"+JSON.stringify(sound)+" ")
      sonicpi.play(sound.chanel)
      global.playing[sound.name] = true
      screen.updateTouch("\n"+JSON.stringify(global.playing))
      // light on
      lights.random(sound.light)
    }
    
  });

  socket.on("keyup", function(data) {
    // OFF 
    global.webactivity = 0
    let sound = key2chanel(data.key)
    if(sound === undefined) {
      screen.touchlog("Bad KeyUp: "+ data.key)
    } else {
      sonicpi.stop(sound.chanel)
      delete global.playing[sound.name]
      screen.updateTouch("\n"+JSON.stringify(global.playing))
    // global.playing.parts[2].on  = false
    // lights stop
    lights.standby(sound.light)
    screen.touchlog("Key: "+ data.key +" Value: UP Sound:"+JSON.stringify(sound)+" ")
    }
    
    
    
  });

});

server.listen(config.websocket_port, function() {
  screen.log('WebSocket Server is running on port: '+config.websocket_port);
});
