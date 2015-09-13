define(['app/Vector', 'app/Sprite', 'app/Settings'], function(Vector, Sprite, Settings) {
    return function () {
        var that = {};
        /* contains each tile as a sprite. */
        var tiles = [];
        /* array of indecies into tiles */
        var tileLayout = [];
        /* the zero tile is always clear */
        tiles.push(undefined);

        var firstFrameDrawn = false;
        that.redrawEachFrame = true;

        function allTilesLoaded () {
            var ret = true;
            for(var i = 1; i < tiles.length; i++) {
                ret = ret && tiles[i].size.x > 0;
            }
            return ret;
        }

        var render = function(context) {
            for(var y = 0; y < Settings.tilesPerColumn; y++) {
                for(var x = 0; x < Settings.tilesPerRow; x++) {
                    var tile = tiles[tileLayout[x + y * Settings.tilesPerRow]];
                    if(typeof tile !== 'undefined') {
                        tile.position.x = x * Settings.tileSize.x;
                        tile.position.y = y * Settings.tileSize.y;
                        tile.draw(context);
                    }
                }
            }
        };

        /* push a generic tile into the pallete */
        that.addTile = function(src) {
            //TODO add type checking of src
            /* check if prerendering was needed */
            tiles.push(Sprite(src, Vector()));
        };

        /* add a predefined sprite into the pallete, useful for animated sprites */
        that.addSprite = function(spr) {
            tiles.push(spr);
        };

        that.addLayout = function(grid) {
            //TODO add size/type checking of grid
            /* clone grid into tile layout */
            tileLayout = grid.slice(0);
            firstFrameDrawn = false;
        };

        that.draw = function(context) {
            if(!that.redrawEachFrame && firstFrameDrawn) return;

            context.clearRect(0, 0, Settings.canvasSize.x, Settings.canvasSize.y);

            if(!firstFrameDrawn) firstFrameDrawn = allTilesLoaded();
            render(context);
        };

        return that;
    };
});
