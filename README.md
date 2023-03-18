# 5G Tower App 


# PHP Tui

* https://github.com/php-school/cli-menu
* https://github.com/rothgar/awesome-tuis
* https://github.com/thermage/thermage


## Sound

* https://puredata.info/
* https://blokas.io/patchbox-os/
* https://github.com/karlstav/cava
* https://github.com/projectM-visualizer/projectm
* https://processing.org/

# Wled

https://github.com/Aircoookie/WLED/wiki/List-of-effects-and-palettes
## Led 1 - A
 http://192.168.30.105/ 
 300 leds - 5m
 http://led-a.local
 Mac: 4cebd6434acc

## Led 2 - B 
http://192.168.30.106/ ??

 ## Led 3 - C 
https://192.168.30.135/
144 leds
http://led-c.local
Mac: 08b61fc0f708

## Power
  http://192.168.30.111/ -> 192.168.30.110	


# Content
What will the machine say ?

[Content](./content.md)


# NodeJS

```bash
./app.js
```

# Text To Speach 

* https://app.coqui.ai/studio/99ab1452-05ee-4a42-a977-712a3661bdee/
* https://github.com/coqui-ai/TTS/tree/dev#install-tts
* https://github.com/rhasspy/larynx
* http://192.168.30.127:5002/


## Gtts

```
bash
pip3 install gTTS
gtts-cli 'hello' --output hello.mp3

```
## Docker 


see `./tts`

```bash
docker run --rm -it -p 5002:5002 --entrypoint /bin/bash ghcr.io/coqui-ai/tts-cpu
python3 TTS/server/server.py --list_models #To get the list of available models
python3 TTS/server/server.py --model_name tts_models/en/vctk/vits # To start a server
```