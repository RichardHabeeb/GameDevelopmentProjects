module.exports = (function (){
    var Rect = require("./Rect.js");
    var Vector = require("./Vector.js");
    var Settings = require("./Settings.js");

    var Entity = function(id) {
        this._velocity = new Vector(0, 0);

        this.svg = $(document.createElementNS(Settings.svgUri, "rect"));
        this.svg.attr({
            id: id,
            width: Settings.player.width,
            height: Settings.player.height
        });

    };

    Entity.prototype.setPosition = function(vector) {
        this.svg.attr({
            x: vector.x,
            y: vector.y
        });
    };

    Entity.prototype.attachTo = function (parent) {
        parent.append(this.svg);
    };

    Entity.prototype.setColor = function (color) {
        this.svg.attr("fill", color);
    };

    return Entity;
})();
