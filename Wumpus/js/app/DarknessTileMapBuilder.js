define(['app/Vector', 'app/Sprite', 'app/Settings', 'app/TileMap'], function(Vector, Sprite, Settings, TileMap) {
    return function(explored) {
        /* clone explored to get same sized array. TODO: type check */
        var layout = explored.slice(0);

        var tileMap = TileMap();
        /*  1 */ tileMap.addTile("img/Darkness 1.png");
        /*  2 */ tileMap.addTile("img/Darkness 2.png");
        /*  3 */ tileMap.addTile("img/Darkness 3.png");
        /*  4 */ tileMap.addTile("img/DarkTrans1.png");
        /*  5 */ tileMap.addTile("img/DarkTrans2.png");
        /*  6 */ tileMap.addTile("img/DarkTrans3.png");
        /*  7 */ tileMap.addTile("img/DarkTrans4.png");
        /*  8 */ tileMap.addTile("img/DarkTrans5.png");
        /*  9 */ tileMap.addTile("img/DarkTrans6.png");
        /* 10 */ tileMap.addTile("img/DarkTrans7.png");
        /* 11 */ tileMap.addTile("img/DarkTrans8.png");
        /* 12 */ tileMap.addTile("img/DarkTrans9.png");
        /* 13 */ tileMap.addTile("img/DarkTrans10.png");
        /* 14 */ tileMap.addTile("img/DarkTrans11.png");
        /* 15 */ tileMap.addTile("img/DarkTrans12.png");
        /* 16 */ tileMap.addTile("img/DarkTrans13.png");
        /* 17 */ tileMap.addTile("img/DarkTrans14.png");
        /* 18 */ tileMap.addTile("img/DarkTrans15.png");


        /* there are faster/better algorithms for this. potential future performance increase.. god this is terrible. */
        /* flood fill, bitwise, etc may work */
        for(var row = 0; row < Settings.tilesPerColumn; row++) {
            for(var col = 0; col < Settings.tilesPerRow; col++) {
                var currentTile = row * Settings.tilesPerRow + col;
                var leftNeighborExplored = col !== 0 && explored[currentTile - 1];
                var rightNeighborExplored = col < (Settings.tilesPerRow - 1) && explored[currentTile + 1];
                var topNeighborExplored = row !== 0 && explored[currentTile - Settings.tilesPerRow];
                var bottomNeighborExplored = row < (Settings.tilesPerColumn - 1) && explored[currentTile + Settings.tilesPerRow];
                var topLeftNeighborExplored = row !== 0 && col !== 0 && explored[currentTile - Settings.tilesPerRow - 1];
                var topRightNeighborExplored = row !== 0 && col < (Settings.tilesPerRow - 1) && explored[currentTile - Settings.tilesPerRow + 1];
                var bottomLeftNeighborExplored =  row < (Settings.tilesPerColumn - 1) && col !== 0 && explored[currentTile + Settings.tilesPerRow - 1];
                var bottomRightNeighborExplored =  row < (Settings.tilesPerColumn - 1) && col < (Settings.tilesPerRow - 1) && explored[currentTile + Settings.tilesPerRow + 1];

                if(!explored[currentTile])
                    { layout[currentTile] = [1,2,3][Math.floor(Math.random()*3)]; }
                else if (!bottomNeighborExplored && !rightNeighborExplored && !topNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 18; }
                else if (!bottomNeighborExplored && !rightNeighborExplored && !topNeighborExplored)
                    { layout[currentTile] = 17; }
                else if (!bottomNeighborExplored && !rightNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 16; }
                else if (!bottomNeighborExplored && !rightNeighborExplored)
                    { layout[currentTile] = 15; }
                else if (!bottomNeighborExplored && !topNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 14; }
                else if (!bottomNeighborExplored && !topNeighborExplored)
                    { layout[currentTile] = 13; }
                else if (!bottomNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 12; }
                else if (!bottomNeighborExplored)
                    { layout[currentTile] = 11; }
                else if (!rightNeighborExplored && !leftNeighborExplored && !topNeighborExplored)
                    { layout[currentTile] = 10; }
                else if (!rightNeighborExplored && !topNeighborExplored)
                    { layout[currentTile] = 9; }
                else if (!rightNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 8; }
                else if (!rightNeighborExplored)
                    { layout[currentTile] = 7; }
                else if (!topNeighborExplored && !leftNeighborExplored)
                    { layout[currentTile] = 6; }
                else if (!topNeighborExplored)
                    { layout[currentTile] = 5; }
                else if (!leftNeighborExplored)
                    { layout[currentTile] = 4; }


                else
                    { layout[currentTile] = 0; }
            }
        }


        tileMap.addLayout(layout);
        tileMap.redrawEachFrame = false;

        return tileMap;
    };
});
