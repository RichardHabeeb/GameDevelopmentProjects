module.exports = (function (){
    var Rect = require("../../common/Rect.js");
    var Vector = require("../../common/Vector.js");
    var Settings = require("../../common/Settings.js");

    var Entity = function(id) {
        this.velocity = new Vector();
        this.appliedForce = new Vector();
        this.mass = Settings.player.mass;
        this.onFloor = false;
        this.svg = $(document.createElementNS(Settings.svgUri, "rect"));
        this.svg.attr({
            id: id,
            width: Settings.player.width,
            height: Settings.player.height
        });
        this.id = id;

    };

    Entity.prototype.setPosition = function(vector) {
        this.svg.attr({
            x: vector.x,
            y: vector.y
        });
    };

    Entity.prototype.getPosition = function() {
        return new Vector(Number(this.svg.attr("x")), Number(this.svg.attr("y"))); //TODO cache these locally?
    };

    Entity.prototype.getHitbox = function() {
        return new Rect(
            Number(this.svg.attr("x")),
            Number(this.svg.attr("y")),
            Number(this.svg.attr("width")),
            Number(this.svg.attr("height"))
        );
    };

    Entity.prototype.attachTo = function (parent) {
        parent.append(this.svg);
    };

    Entity.prototype.hide = function() {
        this.svg.remove();
    };

    Entity.prototype.setColor = function (color) {
        this.svg.attr("fill", color);
    };

    Entity.prototype.getColor = function() {
        return this.svg.attr("fill");
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
        if(Math.abs(this.velocity.x) < Settings.player.stoppedSpeed) this.velocity.x = 0;
        var position = this.getPosition();
        this.setPosition(Vector(position.x + this.velocity.x * elapsedTimeSeconds, position.y + this.velocity.y * elapsedTimeSeconds));
    };

    return Entity;
})();
