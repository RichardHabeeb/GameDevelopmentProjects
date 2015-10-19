window.jQuery = $ = require('jquery');
var Game = require("./Game.js");
var Server = require("./Server.js");
var Settings = require("../../common/Settings.js");
var Message = require("../../messages/Message.js");

window.onload = function() {
    var previousTimeStamp = null;
    var server = null;
    var game = new Game($("body"));
    var loop = function(timeStamp) {
        if(!previousTimeStamp) previousTimeStamp = timeStamp;
        var elapsedTimeSeconds = (timeStamp - previousTimeStamp) / 1000.0;

        game.update(elapsedTimeSeconds);
        game.render();

        previousTimeStamp = timeStamp;
        window.requestAnimationFrame(loop);
    };

    server = new Server(Settings.serverUri, function () {
        window.requestAnimationFrame(loop);
    });
    game.setServer(server);

};
