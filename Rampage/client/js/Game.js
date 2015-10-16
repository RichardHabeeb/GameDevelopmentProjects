module.exports = (function (){
    window.jQuery = $ = require('jquery');
    var Settings = require("./Settings.js");

    var Game = function(parentElement) {
        svgWindow = $("<svg></svg>");
        parentElement.append(svgWindow);
        svgWindow.attr({
            width: Settings.window.width,
            height: Settings.window.height
        });
    };


    Game.prototype.update = function() {

    };

    Game.prototype.render = function() {

    };

    return Game;
})();
