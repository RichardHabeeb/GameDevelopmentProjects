define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Keyboard', 'app/Map', 'app/Entity'], function(Vector, Sprite, Settings, Keyboard, Map, Entity) {
    return function() {
        var that = {};
        var map = Map();
        var keyCodes = {
            up: 38,
            down: 40,
            left: 37,
            right: 39,
            space: 32,
        };
        var keys = Keyboard();
        keys.preventDefault(keyCodes.up);
        keys.preventDefault(keyCodes.down);
        keys.preventDefault(keyCodes.left);
        keys.preventDefault(keyCodes.right);
        keys.preventDefault(keyCodes.space);
        keys.startListener();

        var bunbunSprite = Sprite("img/BunBun.png", Vector(2 * Settings.tileSize.x, 2 * Settings.tileSize.y), Vector(), 32, 12);
        var bunbun = Entity({ running: bunbunSprite });
        map.attachPlayer(bunbun);
        keys.addDownEvent(keyCodes.space, bunbun.jump);


        that.update = function(elapsedTimeSeconds) {
            bunbun.appliedForce.x = 0;
            if(keys.keyPressed[keyCodes.left]) bunbun.appliedForce.x -= 250;
            if(keys.keyPressed[keyCodes.right]) bunbun.appliedForce.x += 250;

            bunbun.update(elapsedTimeSeconds);
            //map.moveAll(Vector(-50 * elapsedTimeSeconds, -50 * elapsedTimeSeconds));
        };

        that.draw = function(elapsedTimeSeconds) {
            map.draw(elapsedTimeSeconds);
        };

        return that;
    };
});
