define(['app/Vector', 'app/Rect'], function(Vector, Rect) {
    return function(sprites) { /* { running: , jumping: , digging:  } */
        var that = {};
        var velocity = Vector(75, 0);
        var gravity = Vector(0, 9.8);
        var onFloor = true;
        var frictionCoef = 0.99;
        var stoppedSpeed = 5.0;
        var currentSprite = sprites.running;
        var digging = false;
        var hitbox = null;
        if(typeof currentSprite !== "undefined") sprites.running.pause();
        that.mass = 50;
        that.topSpeed = 150;
        that.jumpSpeed = -300;
        that.appliedForce = Vector();
        sprites.diggingSide.hide();

        that.draw = function(context, elapsedTimeSeconds) {
            var count = 0;
            count += sprites.running.draw(context, elapsedTimeSeconds) ? 1 : 0;
            count += sprites.diggingSide.draw(context, elapsedTimeSeconds) ? 1 : 0;
            currentSprite.draw(context, 0);
            return count > 0;
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
            if(offset.x !== 0) {
                console.log("1");
            }
            currentSprite.position.x += offset.x;
            currentSprite.position.y += offset.y;
        };

        that.startFalling = function() {
            if(onFloor) onFloor = false;
        };

        /* this rectangle's coords are relative to the sprite's position */
        that.setHitbox = function(rect) {
            hitbox = Rect(rect.x, rect.y, rect.width, rect.height);
        };

        that.getHitbox = function() {
            if(hitbox === null) {
                return Rect().buildFromVectors(currentSprite.position, Vector(currentSprite.getFrameWidth(), currentSprite.size.y));
            } else {
                return Rect(
                    hitbox.x + currentSprite.position.x,
                    hitbox.y + currentSprite.position.y,
                    hitbox.width,
                    hitbox.height);
            }
        };

        that.swapSprite = function(newSprite) {
            if(currentSprite === newSprite) return;
            newSprite.position.x = currentSprite.position.x;
            newSprite.position.y = currentSprite.position.y;
            newSprite.reverse = currentSprite.reverse;
            currentSprite.hide();
            currentSprite = newSprite;
            currentSprite.show();
        };

        that.dig = function () {
            that.swapSprite(sprites.diggingSide);
            currentSprite.play();
            digging = true;
        };

        that.stopDigging = function() {
            that.swapSprite(sprites.running);
            currentSprite.pause();
            digging = false;
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
                    that.swapSprite(sprites.running);
                    currentSprite.play();
                }
                currentSprite.reverse = true;
            }
            if(velocity.x > 0) {
                if(onFloor) {
                    that.swapSprite(sprites.running);
                    currentSprite.play();
                }
                currentSprite.reverse = false;
            }
            if(velocity.x === 0 && onFloor && !digging) {
                that.swapSprite(sprites.running);
                currentSprite.pause();
            }
            currentSprite.position.x += velocity.x * elapsedTimeSeconds;
            currentSprite.position.y += velocity.y * elapsedTimeSeconds;

        };

        return that;
    };
});
