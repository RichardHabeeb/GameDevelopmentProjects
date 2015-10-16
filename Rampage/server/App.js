var WebSocketServer = require('websocket').server;
var express         = require('express');
var Client          = require('./Client.js');
var app             = express();
var server          = app.listen(80);
var wsServer        = new WebSocketServer({ httpServer : server });
var clients         = [];



app.use("/", express.static('client/public'));

var notifyClients = function(message, list) {
    for(var c in list) {
        c.send(message);
    }
};

wsServer.on('request', function(request) {
    var newClient = new Client(request.accept('echo-protocol', request.origin));

    newClient.connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ' + message.utf8Data);
            newClient.send(message.utf8Data);
        }
    });

    clients.push(newClient);
    console.log((new Date()) + ' Connection accepted.');
});
