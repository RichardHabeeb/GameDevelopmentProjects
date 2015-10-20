var WebSocketServer = require('websocket').server;
var express         = require('express');
var Client          = require('./Client.js');
var Vector          = require('../common/Vector.js');
var Message         = require("../messages/Message.js");
var CollisionDetector = require("./CollisionDetector.js");
var fs              = require('fs');
var app             = express();
var server          = app.listen(80);
var wsServer        = new WebSocketServer({ httpServer : server });
var clients         = [];
var attacks         = [];
var totalClients    = 0;
var detector        = new CollisionDetector(clients);

var bg = "<g></g>";
fs.readFile('server/background.svg', 'utf8', function (err, data) {
  if (err) {
    return console.log(err);
  }
  bg = data;
});


app.use("/", express.static('client/public'));

var notifyClients = function(message, list) {
    if(typeof list === "undefined") list = clients;

    for(var i = 0; i < list.length; i++) {
        list[i].send(message);
    }
};

var sendSingleClientUpdates = function(client, list) {
    if(typeof list === "undefined") list = clients;

    for(var i = 0; i < list.length; i++) {
        client.send(list[i].player.getUpdate());
    }
};

var loop = function() {
    detector.sort();

    /* precompute updates */
    var updates = [];
    for(var i = 0; i < clients.length; i++) {
        updates[i] = clients[i].player.getUpdate();
    }

    for(i = 0; i < clients.length; i++) {
        notifyClients(updates[i], clients.slice(0,i).concat(clients.slice(i + 1, clients.length))); //TODO precompute
    }
};
setInterval(loop, 16);

wsServer.on('request', function(request) {
    var newClient = new Client(request.accept('echo-protocol', request.origin));
    newClient.setId(totalClients++);

    /* inform new client of existing clients (TODO maybe unecesarry now)*/
    sendSingleClientUpdates(newClient, clients);

    detector.addClient(newClient);
    console.log((new Date()) + ' Connection accepted.');

    /* notify clients of new player (TODO maybe unecesarry now)*/
    notifyClients(newClient.player.getUpdate());

    /* replay attacks onto svg */
    for(var i = 0; i < attacks.length; i++) {
        newClient.send(attacks[i]);
    }

    var mapMessage = Message("InformMap");
    mapMessage.data.background = bg;
    newClient.send(mapMessage);

    newClient.connection.on('message', function(message) {
        if (message.type === 'utf8') {
            try {
                message = JSON.parse(message.utf8Data);
            } catch (e) {
                console.log("Packet Dropped.");
                return;
            }

            if(message.id === "UpdatePlayer" && newClient.id == message.data.id) {
                newClient.player.recieveUpdate(message);
            } else if(message.id === "Attack" && newClient.id == message.data.id) {
                attacks.push(message);
                notifyClients(message);
            } else {
                console.log("Unknown Packet ID:", message.id);
            }
        }
    });

    newClient.connection.on('close', function(reasonCode, description) {
        console.log((new Date()) + ' Peer disconnected.');
        detector.removeClient(newClient);
        var m = Message("RemovePlayer");
        m.data.id = newClient.id;
        notifyClients(m);
    });


});
