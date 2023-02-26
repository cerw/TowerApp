#!/usr/bin/env php
<?php
require __DIR__ . '/vendor/autoload.php';

$server   = '192.168.30.127';
$port     = 1883;
$clientId = 'cli';


$mqtt = new \PhpMqtt\Client\MqttClient($server, $port, $clientId);
$mqtt->connect();
// stat/tasmota_01F72B/POWER1

$mqtt->subscribe('stat/tasmota_01F72B/#', function ($topic, $message, $retained, $matchedWildcards) {
            echo sprintf("Received message on topic [%s]: %s\n", $topic, $message);
}, 0);

// stat/tasmota_01F72B/POWER1 ON
$mqtt->publish('cmnd/tasmota_01F72B/POWER1', 'ON', 0);

sleep(2);
$mqtt->publish('cmnd/tasmota_01F72B/Status','');

$mqtt->loop(true);


$mqtt->disconnect();
##
