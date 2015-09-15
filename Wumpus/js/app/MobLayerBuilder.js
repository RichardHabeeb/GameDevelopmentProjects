define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/Layer', 'app/SpriteMap'], function(Vector, Sprite, Settings, Layer, SpriteMap) {
    return function(layer, events, treasure, exit) {
        var layout = SpriteMap(layer);
        var pos;
        for(i = 0; i < Settings.numberOfPits; i++) {
            pos = layout.findEmptyPosition();
            layout.attachSprite(Sprite("img/SpaceDirtPit.png"), pos, events.pitEvent);
            layout.attachChildren(pos, "img/SpaceDirtWarning.png", events.pitWarningEvent);
        }

        for(i = 0; i < Settings.numberOfWumpus; i++) {
            pos = layout.findEmptyPosition();
            layout.attachSprite(Sprite(""), pos, events.wumpusEvent);
            layout.attachChildren(pos, "img/Skull.png", events.wumpusWarningEvent);
        }

        for(i = 0; i < Settings.numberOfJellys; i++) {
            pos = layout.findEmptyPosition();
            layout.attachSprite(Sprite("img/BrainJelly.png"), pos, events.jellyEvent);
            layout.attachChildren(pos, "img/JellyTrace.png", events.jellyWarningEvent);
        }


        layout.attachSprite(treasure, layout.findEmptyPosition(), events.treasureEvent);
        layout.attachSprite(exit, layout.findEmptyPosition(), events.exitEvent);

        return layout;
    };
});
