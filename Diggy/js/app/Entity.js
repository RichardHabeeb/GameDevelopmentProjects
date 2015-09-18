define(['app/Vector'], function(Vector) {
    return function(sprite) {
        var that = {};
        var velocity = Vector(75, 0);
        var gravity = Vector(0, 9.8);
        var onFloor = true;
        var frictionCoef = 0.99;

        that.mass = 10;
        that.topSpeed = 75;
        that.appliedForce = Vector();

        that.draw = function(elapsedTimeSeconds) {
            if(typeof sprite !== "undefined") sprite.draw(elapsedTimeSeconds);
        };

        that.update = function(elapsedTimeSeconds) {
            var acceleration = Vector(that.mass * that.appliedForce.x, that.mass * that.appliedForce.y);
            if(!onFloor) acceleration.y += that.mass * gravity.y;
            var frictionForceMag = gravity.y * frictionCoef;
            if(velocity.x > 0) acceleration.x -= frictionForceMag * that.mass;
            if(velocity.x < 0) acceleration.x += frictionForceMag * that.mass;
            velocity.x = Math.min(that.topSpeed, velocity.x + acceleration.x * elapsedTimeSeconds);
            velocity.y = Math.min(that.topSpeed, velocity.y + acceleration.y * elapsedTimeSeconds);
            sprite.position.x += velocity.x * elapsedTimeSeconds;
            sprite.position.y += velocity.y * elapsedTimeSeconds;

        };

        return that;
    };
});
