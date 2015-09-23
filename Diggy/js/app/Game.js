define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Keyboard', 'app/Map', 'app/Entity'], function(Vector, Sprite, Settings, Keyboard, Map, Entity) {
    return function() {
        var that = {};
        var map = Map();
        var keyCodes = {
            up: 38,
            down: 40,
            left: 37,
            right: 39,
        };
        var keys = Keyboard();
        keys.preventDefault(keyCodes.up);
        keys.preventDefault(keyCodes.down);
        keys.preventDefault(keyCodes.left);
        keys.preventDefault(keyCodes.right);
        keys.startListener();

        var bunbunSprite = Sprite("img/BunBun.png", Vector(2 * Settings.tileSize.x, 2 * Settings.tileSize.y), Vector(), 32, 8);
        var bunbun = Entity({ running: bunbunSprite });
        map.attachPlayer(bunbun);
        //bunbun.appliedForce.x = 250;




        that.update = function(elapsedTimeSeconds) {
            if(keys.keyPressed[keyCodes.left]) bunbun.appliedForce.x = -250;
            else if(keys.keyPressed[keyCodes.right]) bunbun.appliedForce.x = 250;
            else bunbun.appliedForce.x = 0;
            bunbun.update(elapsedTimeSeconds);
            //map.moveAll(Vector(-50 * elapsedTimeSeconds, -50 * elapsedTimeSeconds));
        };

        that.draw = function(elapsedTimeSeconds) {
            map.draw(elapsedTimeSeconds);
        };

        return that;
    };
});
