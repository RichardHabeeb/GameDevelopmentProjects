module.exports = (function (){
    window.jQuery = $ = require('jquery');
    var Settings = require("./Settings.js");
    var Entity = require("./Entity.js");
    var Vector = require("./Vector.js");

    var Game = function(parentElement) {
        this.svgWindow = $(document.createElementNS(Settings.svgUri, "svg"));
        parentElement.append(this.svgWindow);
        this.svgWindow.attr({
            width: Settings.window.width,
            height: Settings.window.height
        });
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

    };

    Game.prototype.render = function() {

    };

    return Game;
})();
