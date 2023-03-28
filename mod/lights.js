const mqttClient = require("./mqtt");
const screen = require("./screen");
// const system = require("./system");

let leds = ["a", "b", "c"];

// const effect_disco = '<?xml version="1.0" ?><vs><ac>128</ac><cl>255</cl><cl>160</cl><cl>0</cl><cs>0</cs><cs>0</cs><cs>0</cs><ns>0</ns><nr>1</nr><nl>0</nl><nf>1</nf><nd>60</nd><nt>0</nt><fx>68</fx><sx>64</sx><ix>128</ix><fp>18</fp><wv>0</wv><ws>0</ws><ps>0</ps><cy>0</cy><ds>Led A</ds><ss>0</ss></vs>'
// const effect_drip = '<?xml version="1.0" ?><vs><ac>0</ac><cl>255</cl><cl>160</cl><cl>0</cl><cs>0</cs><cs>0</cs><cs>0</cs><ns>0</ns><nr>1</nr><nl>0</nl><nf>1</nf><nd>60</nd><nt>0</nt><fx>68</fx><sx>64</sx><ix>128</ix><fp>2</fp><wv>0</wv><ws>0</ws><ps>0</ps><cy>0</cy><ds>Led A</ds><ss>0</ss></vs>'

function allLightRandom() {
  screen.log("allLightRandom:");
  leds.forEach((led) => {
    lightRandom(led);
  });
}

function allLightOn(effect = "Flicker") {
  screen.log("allLightOn: " + effect);
  leds.forEach((led) => {
    lightOn(led);
  });
}

function allLightOff() {
  screen.log("allLightOff: ");
  leds.forEach((led) => {
    lightOff(led);
  });
}

function allLightStandby() {
  screen.log("allLightStandby: ");
  leds.forEach((led) => {
    standby(led);
  });
}

function lightOn(led) {
  screen.log("Ligts on led:" + led);
  // red by default
  mqttClient.publish("wled/" + led + "/api", '{ "on": true }');
}

function lightOff(led) {
  screen.log("Ligts off led:" + led);
  mqttClient.publish(
    "wled/" + led + "/api",
    //'{"effect":"Scan","state":"ON","brightness":255,"color":{"r":255,"g":0,"b":0}}'
    // '{"effect":"None","state":"OFF","brightness":255,"color":{"r":255,"g":255,"b":255}}'
    '{ "on": false }'
  );
}

function randomColor() {
  return (
    '{"r": ' +
    randomRgb() +
    ', "g": ' +
    randomRgb() +
    ', "b": ' +
    randomRgb() +
    "}"
  );
}

function lightRandom(led) {
  screen.log("Ligts lightRandom led:" + led);
  // random between 1 - 117
  // let fx = Math.floor(Math.random() * 117) + 1;
  mqttClient.publish(
    "wled/" + led + "/api",
    '{"on": true, "transition": 7, "seg": [{"fx": "r"}]}'
  );
}

function standby(led) {
  screen.log("Ligts standby led:" + led);
  // red by default
  mqttClient.publish(
    "wled/" + led + "/api",
    '{"on":true,"bri":128,"transition":7,"ps":-1,"pl":-1,"nl":{"on":false,"dur":60,"mode":1,"tbri":0,"rem":-1},"udpn":{"send":false,"recv":true},"lor":0,"mainseg":0,"seg":[{"id":0,"start":0,"stop":244,"len":244,"grp":1,"spc":0,"of":0,"on":true,"frz":false,"bri":255,"cct":127,"col":[[255,38,49,0],[0,0,0,0],[0,0,0,0]],"fx":68,"sx":64,"ix":162,"pal":63,"c1":128,"c2":128,"c3":16,"sel":true,"rev":false,"mi":false,"o1":false,"o2":false,"o3":false,"si":0,"m12":1}]}'
  );
}

s = 255;
function randomRgb() {
  return Math.round(Math.random() * s);
}

module.exports.standby = standby;
// module.exports.rainbow = rainbow
module.exports.on = lightOn;
module.exports.off = lightOff;
module.exports.random = lightRandom;
// module.exports.lightRandomWipe = lightRandomWipe;
module.exports.allLightOff = allLightOff;
module.exports.allLightOn = allLightOn;
module.exports.allLightStandby = allLightStandby;
module.exports.allLightRandom = allLightRandom;

// module.exports.bpm = bpm
