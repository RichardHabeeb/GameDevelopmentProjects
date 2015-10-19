module.exports = (function (){
    window.jQuery = $ = require('jquery');
    var Settings = require("../../common/Settings.js");
    var Entity = require("./Entity.js");
    var Vector = require("../../common/Vector.js");
    var Keyboard = require("./Keyboard.js");
    var keyCodes = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        space: 32,
        z: 90,
        x: 88,
    };

    var Game = function(parentElement) {
        this.svgWindow = $(document.createElementNS(Settings.svgUri, "svg"));
        parentElement.append(this.svgWindow);
        this.svgWindow.attr({
            width: Settings.window.width,
            height: Settings.window.height
        });

        this.keys = new Keyboard();
        this.keys.startListener();
        this.player = { id: null }; /* this is so we can pass a reference */
        this.entities = {};
    };

    Game.prototype.setServer = function(server) {
        var svgWindow = this.svgWindow;
        var entities = this.entities;
        var player = this.player;

        server.addMessageHandler("UpdatePlayer", function (message) {
            if(message.id in entities) {
                entities[message.id].setPosition(new Vector(message.x, message.y));
            } else {
                console.log("Recieved New Player.");
                var newPlayer = new Entity(message.id);
                newPlayer.setPosition(new Vector(message.x, message.y));
                newPlayer.setColor(message.color);
                newPlayer.attachTo(svgWindow); //TODO layers
                entities[message.id] = newPlayer;
            }
        });

        server.addMessageHandler("InformId", function (message) {
            player.id = message.id;

        });
    };


    Game.prototype.update = function(elapsedTimeSeconds) {
        if(this.player.id !== null && typeof this.entities[this.player.id] !== "undefined") {
            var player = this.entities[this.player.id];
            player.appliedForce.x = 0;
            if(this.keys.keyPressed[keyCodes.left]) player.appliedForce.x -= Settings.player.movementForce;
            if(this.keys.keyPressed[keyCodes.right]) player.appliedForce.x += Settings.player.movementForce;
        }

        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                this.entities[id].update(elapsedTimeSeconds);
            }
        }
    };

    Game.prototype.render = function() {

    };

    return Game;
})();
