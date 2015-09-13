define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Layer'], function(Vector, Sprite, Settings, Layer) {
    return function(layer, events, treasures, exit) {
        var layout = new Array(Settings.tilesPerRow * Settings.tilesPerColumn);
        layout.fill(events.default);

        function findASpot(sprite, setEvent) {
            var pos = Vector();
            do {
                pos = Vector(
                    Math.floor(Math.random()*Settings.tilesPerRow),
                    Math.floor(Math.random()*Settings.tilesPerColumn));
            } while(layout[pos.y * Settings.tilesPerRow + pos.x] !== events.default); /* todo, add timeout for edge case*/
            layer.attachSprite(sprite);
            sprite.position = Vector(pos.x*Settings.tileSize.x, pos.y*Settings.tileSize.y);
            layout[pos.y * Settings.tilesPerRow + pos.x] = setEvent;
            return pos;
        }

        function fillInAdjacentCells(pos, src, setEvent) {
            if(pos.y !== 0 && layout[(pos.y - 1) * Settings.tilesPerRow + pos.x] === events.default) {
                layer.attachSprite(Sprite(src, Vector(pos.x*Settings.tileSize.x, (pos.y - 1)*Settings.tileSize.y)));
                layout[(pos.y - 1) * Settings.tilesPerRow + pos.x] = setEvent;
            }
            if((pos.y + 1) !== Settings.tilesPerColumn  && layout[(pos.y + 1) * Settings.tilesPerRow + pos.x] === events.default) {
                layer.attachSprite(Sprite(src, Vector(pos.x*Settings.tileSize.x, (pos.y + 1)*Settings.tileSize.y)));
                layout[(pos.y + 1) * Settings.tilesPerRow + pos.x] = setEvent;
            }
            if(pos.x !== 0 && layout[pos.y * Settings.tilesPerRow + pos.x - 1] === events.default) {
                layer.attachSprite(Sprite(src, Vector((pos.x - 1)*Settings.tileSize.x, pos.y*Settings.tileSize.y)));
                layout[pos.y* Settings.tilesPerRow + pos.x - 1] = setEvent;
            }
            if((pos.x + 1) !== Settings.tilesPerRow && layout[pos.y * Settings.tilesPerRow + pos.x + 1] === events.default) {
                layer.attachSprite(Sprite(src, Vector((pos.x + 1)*Settings.tileSize.x, pos.y*Settings.tileSize.y)));
                layout[pos.y* Settings.tilesPerRow + pos.x + 1] = setEvent;
            }
        }

        for(i = 0; i < Settings.numberOfPits; i++) {
            fillInAdjacentCells(findASpot(Sprite("img/SpaceDirtPit.png", Vector()), events.pitEvent), "img/SpaceDirtWarning.png", events.pitWarningEvent);
        }

        for(i = 0; i < Settings.numberOfJellys; i++) {
            fillInAdjacentCells(findASpot(Sprite("img/BrainJelly.png", Vector()), events.jellyEvent), "img/JellyTrace.png", events.jellyWarningEvent);
        }

        for(i = 0; i < Settings.numberOfWumpus; i++) {
            fillInAdjacentCells(findASpot(Sprite("", Vector()), events.wumpusEvent), "img/Skull.png", events.wumpusWarningEvent);
        }

        for(i = 0; i < Settings.numberOfTreasures; i++) {
            findASpot(treasures[i], events.treasureEvent);
        }
        
        findASpot(exit, events.exitEvent);

        return layout;
    };
});
