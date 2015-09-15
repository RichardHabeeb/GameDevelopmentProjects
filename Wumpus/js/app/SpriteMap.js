define(['app/Vector', 'app/Cell', 'app/Settings'], function(Vector, Cell, Settings) {
    return function(layer) {
        var that = {};
        var gridCells = [];

        for(var y = 0; y < Settings.tilesPerColumn; y++) {
            for(var x = 0; x < Settings.tilesPerRow; x++) {
                gridCells[pos.y * Settings.tilesPerRow + pos.x] = Cell();
            }
        }

        var getCell = function(pos) {
            if(pos.y < 0 || pos.x < 0 || pos.x >= Settings.tilesPerRow || pos.y >= Settings.tilesPerColumn) return null;
            return gridCells[pos.y * Settings.tilesPerRow + pos.x];
        };

        that.findEmptyPosition = function() {
            var pos = null;
            do {
                pos = Vector(
                    Math.floor(Math.random() * Settings.tilesPerRow),
                    Math.floor(Math.random() * Settings.tilesPerColumn));
            } while(getCell(pos).sprite === null); /* todo, add timeout for edge case*/
            return pos;
        };

        that.attactSprite = function(pos, sprite ) {
            getCell(pos).sprite = sprite;
        };

        that.attachChildren = function(pos, childImage, childEvent) {
            var parent = getCell(pos);
            var north = getCell(Vector(pos.x, pos.y - 1));
            var east = Vector(pos.x + 1, pos.y);
            var south = Vector(pos.x, pos.y + 1);
            var west = Vector(pos.x - 1, pos.y);

            if(parent === null) return;
            if(north !== null && north.sprite === null) {
                north.sprite = Sprite(childImage, Vector(pos.x * Settings.tileSize.x, pos.y * Settings.tileSize.y));
                north.event = childEvent;
                layer.attachSprite(north.sprite);
                parent.childCells.north = north;
            }
        };

        that.moveParentSprite = function(entity, newPos) {
            // for(var y = 0; y < Settings.tilesPerColumn; y++) {
            //     for(var x = 0; x < Settings.tilesPerRow; x++) {
            //         var cell = that.getCell(Vector(x, y));
            //         for(var i = 0; i < cell.entities.length; i++) {
            //             if(cell.entities[i] == entity) {
            //
            //             }
            //         }
            //     }
            // }
        };

        that.triggerEvents = function(pos, sender) {
            getCell(pos).triggerEvents(sender);
        };





        return that;
    };
});
