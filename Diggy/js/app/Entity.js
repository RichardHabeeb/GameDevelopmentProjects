define(['app/Vector', 'app/Rect'], function(Vector, Rect) {
    return function(sprites) { /* { running: , jumping: , digging:  } */
        var that = {};
        var velocity = Vector(75, 0);
        var gravity = Vector(0, 9.8);
        var onFloor = true;
        var frictionCoef = 0.99;
        var stoppedSpeed = 5.0;
        var currentSprite = sprites.running;
        if(typeof currentSprite !== "undefined") sprites.running.pause();
        that.mass = 50;
        that.topSpeed = 150;
        that.jumpSpeed = -300;
        that.appliedForce = Vector();

        that.draw = function(context, elapsedTimeSeconds) {
            return currentSprite.draw(context, elapsedTimeSeconds);
        };

        that.jump = function() {
            if(onFloor) {
                onFloor = false;
                velocity.y = that.jumpSpeed;
            }
        };

        that.collide = function(offset) {
            if(offset.y < 0 && velocity.y > 0) {
                onFloor = true;
                velocity.y = 0;
            }
            if(offset.y > 0 && velocity.y < 0) {
                velocity.y = 0;
            }
            currentSprite.position.x += offset.x;
            currentSprite.position.y += offset.y;
        };

        that.startFalling = function() {
            if(onFloor) onFloor = false;
        };

        that.getHitbox = function() {
            return Rect().buildFromVectors(currentSprite.position, Vector(currentSprite.getFrameWidth(), currentSprite.size.y));
        };

        that.update = function(elapsedTimeSeconds) {
            var acceleration = Vector(that.mass * that.appliedForce.x, that.mass * that.appliedForce.y);
            if(!onFloor) {
                acceleration.y += that.mass * gravity.y;
            }
            var frictionForceMag = gravity.y * frictionCoef;
            if(velocity.x > 0) acceleration.x -= frictionForceMag * that.mass;
            if(velocity.x < 0) acceleration.x += frictionForceMag * that.mass;
            velocity.x = Math.max(-that.topSpeed, Math.min(that.topSpeed, velocity.x + acceleration.x * elapsedTimeSeconds));
            velocity.y = velocity.y + acceleration.y * elapsedTimeSeconds;
            if(Math.abs(velocity.x) < stoppedSpeed) velocity.x = 0;
            if(velocity.x < 0) {
                if(onFloor) {
                    currentSprite = sprites.running;
                    currentSprite.play();
                }
                currentSprite.reverse = true;
            }
            if(velocity.x > 0) {
                if(onFloor) {
                    currentSprite = sprites.running;
                    currentSprite.play();
                }
                currentSprite.reverse = false;
            }
            if(velocity.x === 0 && onFloor) {
                currentSprite = sprites.running;
                currentSprite.pause();
            }
            currentSprite.position.x += velocity.x * elapsedTimeSeconds;
            currentSprite.position.y += velocity.y * elapsedTimeSeconds;

        };

        return that;
    };
});
