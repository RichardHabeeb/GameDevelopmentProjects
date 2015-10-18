module.exports = (function (){
    window.jQuery = $ = require('jquery');
    var Settings = require("./Settings.js");
    var Entity = require("./Entity.js");
    var Vector = require("./Vector.js");
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
        this.player = null;
        this.entities = [];
    };

    Game.prototype.setServer = function(server) {
        var svgWindow = this.svgWindow;

        server.addMessageHandler("NewPlayer", function (message) {
            console.log("Recieved New Player.");
            var newPlayer = new Entity(message.id);
            newPlayer.setPosition(new Vector(message.x, message.y));
            newPlayer.setColor(message.color);
            newPlayer.attachTo(svgWindow); //TODO layers
        });
    };


    Game.prototype.update = function() {
        if(this.player !== null) {
            this.player.appliedForce.x = 0;
            if(this.keys.keyPressed[keyCodes.left]) this.player.appliedForce.x -= Settings.player.movementForce;
            if(this.keyPressed[keyCodes.right]) this.player.appliedForce.x += Settings.player.movementForce;
        }

        for(var i = 0; i < this.entities.lenth; i++) {
            this.entities[i].update();
        }
    };

    Game.prototype.render = function() {

    };

    return Game;
})();
