define(['app/Vector'], function(Vector) {
    return function(sprites) { /* { running: , jumping: , digging:  } */
        var that = {};
        var velocity = Vector(75, 0);
        var gravity = Vector(0, 9.8);
        var onFloor = true;
        var frictionCoef = 0.99;
        var stoppedSpeed = 5.0;
        var states = { standing: 0, running: 1, jumping: 2, digging: 3 };
        var currentState = states.running;
        var currentSprite = sprites.running;
        if(typeof currentSprite !== "undefined") sprites.running.pause();
        that.mass = 50;
        that.topSpeed = 150;
        that.appliedForce = Vector();

        that.draw = function(elapsedTimeSeconds) {
            if(typeof currentSprite !== "undefined") {
                return currentSprite.draw(elapsedTimeSeconds);
            }
            return false;
        };

        that.update = function(elapsedTimeSeconds) {
            var acceleration = Vector(that.mass * that.appliedForce.x, that.mass * that.appliedForce.y);
            if(!onFloor) acceleration.y += that.mass * gravity.y;
            var frictionForceMag = gravity.y * frictionCoef;
            if(velocity.x > 0) acceleration.x -= frictionForceMag * that.mass;
            if(velocity.x < 0) acceleration.x += frictionForceMag * that.mass;
            velocity.x = Math.max(-that.topSpeed, Math.min(that.topSpeed, velocity.x + acceleration.x * elapsedTimeSeconds));
            velocity.y = Math.max(-that.topSpeed, Math.min(that.topSpeed, velocity.y + acceleration.y * elapsedTimeSeconds));
            if(Math.abs(velocity.x) < stoppedSpeed) velocity.x = 0;
            currentSprite.position.x += velocity.x * elapsedTimeSeconds;
            currentSprite.position.y += velocity.y * elapsedTimeSeconds;

        };

        return that;
    };
});
