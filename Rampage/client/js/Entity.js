module.exports = (function (){
    var Rect = require("./Rect.js");
    var Vector = require("./Vector.js");
    var Settings = require("./Settings.js");

    var Entity = function(id) {
        this.velocity = new Vector();
        this.appliedForce = new Vector();
        this.mass = Settings.player.mass;
        this.onFloor = true;
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

    Entity.prototype.getPosition = function() {
        return new Vector(Number(this.svg.attr("x")), Number(this.svg.attr("y")));
    };

    Entity.prototype.attachTo = function (parent) {
        parent.append(this.svg);
    };

    Entity.prototype.setColor = function (color) {
        this.svg.attr("fill", color);
    };

    Entity.prototype.update = function(elapsedTimeSeconds) {
        var acceleration = Vector(this.mass * this.appliedForce.x, this.mass * this.appliedForce.y);
        if(!this.onFloor) {
            acceleration.y += this.mass * Settings.gravity.y;
        }
        var frictionForceMag = Settings.gravity.y * Settings.frictionCoef;
        if(this.velocity.x > 0) acceleration.x -= frictionForceMag * this.mass;
        if(this.velocity.x < 0) acceleration.x += frictionForceMag * this.mass;
        this.velocity.x = Math.max(-Settings.player.topSpeed, Math.min(Settings.player.topSpeed, this.velocity.x + acceleration.x * elapsedTimeSeconds));
        this.velocity.y = this.velocity.y + acceleration.y * elapsedTimeSeconds;
        if(Math.abs(velocity.x) < stoppedSpeed) velocity.x = 0;
        var position = this.getPosition();
        this.setPosition(position.x + velocity.x * elapsedTimeSeconds, position.y + velocity.y * elapsedTimeSeconds);
    };

    return Entity;
})();
