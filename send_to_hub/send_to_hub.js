// Copyright (c) Microsoft. All rights reserved.
// Licensed under the MIT license. See LICENSE file in the project root for full license information.

'use strict';

//var Protocol = require('azure-iot-device-amqp').Amqp;
// Uncomment one of these transports and then change it in fromConnectionString to test other transports
// var Protocol = require('azure-iot-device-amqp').AmqpWs;
var Protocol = require('azure-iot-device-http').Http;
 //var Protocol = require('azure-iot-device-mqtt').Mqtt;
// var Protocol = require('azure-iot-device-mqtt').MqttWs;
var Client = require('azure-iot-device').Client;
var Message = require('azure-iot-device').Message;

// String containing Hostname, Device Id & Device Key in the following formats:
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
//var connectionString = "ID=power PrimaryKey=YQajcX2Ak8J5DOROXfPq4nHFJHqUZeI982gE8gVMc0M= SecondaryKey=Eh7qWBQdiMaz8MtDTn38UDiC9wQqT7Vm6udTWf+ZWIg=";
var connectionString = "HostName=power.azure-devices.net;DeviceId=pawel;SharedAccessKey=E9YTR1A4XcaiHJcH01Dn3aRguY7i0jJHggZOzVdNd6Q=;"
//  "HostName=<iothub_host_name>;DeviceId=<device_id>;SharedAccessKey=<device_key>"
// fromConnectionString must specify a transport constructor, coming from any transport package.
var client = Client.fromConnectionString(connectionString, Protocol);
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'garden'
});
var connectCallback = function (err) {
  if (err) {
    console.error('Could not connect: ' + err.message);
  } else {
    console.log('Client connected');
    /*client.on('message', function (msg) {
      console.log('Id: ' + msg.messageId + ' Body: ' + msg.data);
      client.complete(msg, printResultFor('completed'));
      // reject and abandon follow the same pattern.
      // /!\ reject and abandon are not available with MQTT
    });*/

    // Create a message and send it to the IoT Hub every second
    var sendInterval = setIterval( function () {
      var windSpeed = 10 + (Math.random() * 4); // range: [10, 14]
      var data = JSON.stringify({ deviceId: 'myFirstDevice', windSpeed: windSpeed });
connection.query('SELECT * from sensors_data', function(error, results, fields) {
  data=JSON.stringify({costam: results[0].temperature});

  var message = new Message(data);
      console.log('Sending message: ' + message.getData());
      client.sendEvent(message, printResultFor('send'));
    });
console.log(data);
    },15000);
 


    client.on('error', function (err) {
      console.error(err.message);
    });

    client.on('disconnect', function () {
      //clearInterval(sendInterval);
      client.removeAllListeners();
	connection.connect();
      client.open(connectCallback);
    });
  }
};

client.open(connectCallback);

// Helper function to print results in the console
function printResultFor(op) {
  return function printResult(err, res) {
    if (err) console.log(op + ' error: ' + err.toString());
    if (res) console.log(op + ' status: ' + res.constructor.name);
  };
}