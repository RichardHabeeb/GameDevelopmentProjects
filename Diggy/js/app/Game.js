define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Grid', 'app/TileMap', 'app/Map', 'app/Entity'], function(Vector, Sprite, Settings, Grid, TileMap, Map, Entity) {
    return function() {
        var that = {};
        var map = Map();

        var bunbunSprite = Sprite("img/BunBun.png", Vector(2 * Settings.tileSize.x, 2 * Settings.tileSize.y), Vector(), 32, 8);

        var bunbun = Entity(bunbunSprite);
        map.attachPlayer(bunbunSprite);
        bunbun.appliedForce.x = 250;


        that.update = function(elapsedTimeSeconds) {
            bunbun.update(elapsedTimeSeconds);
            //map.moveAll(Vector(-50 * elapsedTimeSeconds, -50 * elapsedTimeSeconds));
        };

        that.draw = function(elapsedTimeSeconds) {
            map.draw(elapsedTimeSeconds);
        };

        return that;
    };
});
