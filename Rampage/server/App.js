var WebSocketServer = require('websocket').server;
var express         = require('express');
var Client          = require('./Client.js');
var Message         = require("../messages/Message.js");
var app             = express();
var server          = app.listen(80);
var wsServer        = new WebSocketServer({ httpServer : server });
var clients         = [];



app.use("/", express.static('client/public'));

var notifyClients = function(message, list) {
    if(typeof list === "undefined") list = clients;

    for(var i = 0; i < list.length; i++) {
        list[i].send(message);
    }
};

wsServer.on('request', function(request) {
    var newClient = new Client(request.accept('echo-protocol', request.origin));
    newClient.setId(clients.length);
    clients.push(newClient);
    console.log((new Date()) + ' Connection accepted.');
    notifyClients(newClient.player.getUpdate());
    console.log('Notified clients.');

    newClient.connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            newClient.send(JSON.parse(message.utf8Data));
        }
    });

});
