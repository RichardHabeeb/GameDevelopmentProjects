define(['app/Vector', 'app/Cell', 'app/Settings', 'app/Sprite'], function(Vector, Cell, Settings, Sprite) {
    return function(layer) {
        var that = {};
        var gridCells = [];

        for(var y = 0; y < Settings.tilesPerColumn; y++) {
            for(var x = 0; x < Settings.tilesPerRow; x++) {
                gridCells[y * Settings.tilesPerRow + x] = Cell();
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
            } while(getCell(pos).sprite !== null); /* todo, add timeout for edge case*/
            return pos;
        };

        that.attachSprite = function(sprite, pos, event) {
            var cell = getCell(pos);
            cell.sprite = sprite;
            cell.event = event;
            sprite.position.x = pos.x * Settings.tileSize.x;
            sprite.position.y = pos.y * Settings.tileSize.y;
            layer.attachSprite(sprite);

        };

        that.attachChildren = function(pos, childImage, childEvent) {
            var parent = getCell(pos);
            var north = getCell(Vector(pos.x, pos.y - 1));
            var east = getCell(Vector(pos.x + 1, pos.y));
            var south = getCell(Vector(pos.x, pos.y + 1));
            var west = getCell(Vector(pos.x - 1, pos.y));

            if(parent === null) return;
            if(north !== null && north.sprite === null) {
                north.sprite = Sprite(childImage, Vector(pos.x * Settings.tileSize.x, (pos.y - 1) * Settings.tileSize.y));
                north.event = childEvent;
                layer.attachSprite(north.sprite);
                parent.childCells.north = north;
            }
            if(east !== null && east.sprite === null) {
                east.sprite = Sprite(childImage, Vector((pos.x + 1) * Settings.tileSize.x, pos.y * Settings.tileSize.y));
                east.event = childEvent;
                layer.attachSprite(east.sprite);
                parent.childCells.east = east;
            }
            if(south !== null && south.sprite === null) {
                south.sprite = Sprite(childImage, Vector(pos.x * Settings.tileSize.x, (pos.y + 1) * Settings.tileSize.y));
                south.event = childEvent;
                layer.attachSprite(south.sprite);
                parent.childCells.south = south;
            }
            if(west !== null && west.sprite === null) {
                west.sprite = Sprite(childImage, Vector((pos.x - 1) * Settings.tileSize.x, pos.y * Settings.tileSize.y));
                west.event = childEvent;
                layer.attachSprite(west.sprite);
                parent.childCells.west = west;
            }
        };

        that.removeParent = function(pos) {
            var parent = getCell(pos);
            if(parent === null) return;
            if(parent.childCells.north !== null) {
                layer.removeSprite(parent.childCells.north.sprite);
                parent.childCells.north.sprite = null;
                parent.childCells.north.event = function() {};
            }
            if(parent.childCells.east !== null) {
                layer.removeSprite(parent.childCells.east.sprite);
                parent.childCells.east.sprite = null;
                parent.childCells.east.event = function() {};
            }
            if(parent.childCells.south !== null) {
                layer.removeSprite(parent.childCells.south.sprite);
                parent.childCells.south.sprite = null;
                parent.childCells.south.event = function() {};
            }
            if(parent.childCells.west !== null) {
                layer.removeSprite(parent.childCells.west.sprite);
                parent.childCells.west.sprite = null;
                parent.childCells.west.event = function() {};
            }
            layer.removeSprite(parent.sprite);
            parent.sprite = null;
            parent.event = function() {};
            parent.childCells = {
                north: null,
                east: null,
                south: null,
                west: null
            };

        };

        that.triggerEvent = function(pos) {
            var cell = getCell(pos);
            cell.event(cell.sprite, pos);
        };





        return that;
    };
});
