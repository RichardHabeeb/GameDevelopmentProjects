define(['app/Vector'], function(Vector) {
    return function(src, position, origin, frameWidth, framesPerSecond, onLoad) {
        var that = {};
        var playhead = 0;
        var keyFrame = 0;
        var img = new Image();
        var numFrames = 0;
        var pausedFramesPerSecond = 0;
        var destination = Vector();
        var velocity = Vector();
        var elapsedAnimationTimeSeconds = 0;
        var animationTimeSeconds = 0;
        var animationComplete = function () {};
        if(typeof framesPerSecond === "undefined") framesPerSecond = 0;
        if(typeof position === "undefined") position = Vector();
        if(typeof origin === "undefined") origin = Vector();

        that.position = Vector(position.x, position.y);
        that.size = Vector();
        that.reverse = false;

        that.visible = function(sizeVector) {
            return (
                (that.position.x + that.size.x) >= 0 && that.position.x <= sizeVector.x &&
                (that.position.y + that.size.y) >= 0 && that.position.y <= sizeVector.y);
        };

        that.pause = function() {
            if(framesPerSecond !== 0) pausedFramesPerSecond = framesPerSecond;
            playhead = 0;
            framesPerSecond = 0;
        };

        that.play = function () {
            playhead = 0;
            if(pausedFramesPerSecond !== 0) framesPerSecond = pausedFramesPerSecond;
        };

        that.draw = function(context, elapsedTimeSeconds) {
            if(that.size.x === 0) return;
            if(animationTimeSeconds > 0) {
                that.position.x += velocity.x * elapsedTimeSeconds;
                that.position.y += velocity.y * elapsedTimeSeconds;
                elapsedAnimationTimeSeconds += elapsedTimeSeconds;
                if(elapsedAnimationTimeSeconds >= animationTimeSeconds) {
                    that.position.x = destination.x;
                    that.position.y = destination.y;
                    animationTimeSeconds = 0;
                    animationComplete();
                }
            }

            playhead += elapsedTimeSeconds;
            /* Using Math.floor here gets a pretty significant performance increase. I am using a floor hack that gets even better performance. */
            keyFrame = ~~(playhead * framesPerSecond) % numFrames;

            context.save();
            var drawX = ~~(that.position.x - origin.x);
            if(that.reverse)
            {
                context.scale(-1, 1);
                drawX = -drawX - frameWidth;
            }
            context.drawImage(img,
                frameWidth * keyFrame,
                0,
                frameWidth,
                that.size.y,
                drawX,
                ~~(that.position.y - origin.y),
                frameWidth,
                that.size.y);
            context.restore();
        };

        img.onload = function() {
            that.size.x = img.width;
            that.size.y = img.height;
            if(typeof frameWidth === "undefined") frameWidth = that.size.x;
            numFrames = Math.round(that.size.x / frameWidth);
            if(typeof onLoad !== "undefined") onLoad();
        };


        that.tweenPosition = function(distance, timeSeconds, onComplete) {
            destination.x = that.position.x + distance.x;
            destination.y = that.position.y + distance.y;
            velocity.x = distance.x / timeSeconds;
            velocity.y = distance.y / timeSeconds;
            animationComplete = onComplete;
            animationTimeSeconds = timeSeconds;
            elapsedAnimationTimeSeconds = 0;
        };


        img.src = src;

        return that;
    };
});
