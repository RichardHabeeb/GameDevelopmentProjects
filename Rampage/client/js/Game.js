module.exports = (function (){
    window.jQuery = $ = require('jquery');
    var Settings = require("../../common/Settings.js");
    var Entity = require("./Entity.js");
    var Vector = require("../../common/Vector.js");
    var Keyboard = require("./Keyboard.js");
    var keyCodes = {
        up: 38,
        down: 40,
        left: 37,
        right: 39,
        space: 32,
        z: 90,
        x: 88,
    };

    var Game = function(parentElement) {
        this.svgWindow = $(document.createElementNS(Settings.svgUri, "svg"));
        this.svgWindow.attr({
            width: Settings.window.width,
            height: Settings.window.height
        });
        this.backgroundGroup = $(document.createElementNS(Settings.svgUri, "g"));
        this.playerGroup = $(document.createElementNS(Settings.svgUri, "g"));
        parentElement.append(this.svgWindow);
        this.svgWindow.append(this.backgroundGroup);
        this.svgWindow.append(this.playerGroup);


        this.keys = new Keyboard();
        this.keys.startListener();
        this.player = { id: null }; /* this is so we can pass a reference */
        this.entities = {};
        this.viewBoxOffset = Vector();
    };

    Game.prototype.setServer = function(server) {
        var playerGroup = this.playerGroup;
        var backgroundGroup = this.backgroundGroup;
        var entities = this.entities;
        var player = this.player;

        server.addMessageHandler("UpdatePlayer", function (message) {
            if(message.id in entities) {
                entities[message.id].setPosition(new Vector(message.x, message.y));
            } else {
                console.log("Recieved New Player.");
                var newPlayer = new Entity(message.id);
                newPlayer.setPosition(new Vector(message.x, message.y));
                newPlayer.setColor(message.color);
                newPlayer.attachTo(playerGroup); //TODO layers
                entities[message.id] = newPlayer;
            }
        });

        server.addMessageHandler("InformId", function (message) {
            player.id = message.id;

        });

        server.addMessageHandler("InformMap", function(message) {
            var parser = new DOMParser();
            doc = parser.parseFromString(message.background, "image/svg+xml");
            doc.namespaceURI = Settings.svgUri;
            backgroundGroup.append(doc.children);
        });
    };


    Game.prototype.update = function(elapsedTimeSeconds) {
        if(this.player.id !== null && typeof this.entities[this.player.id] !== "undefined") {
            var player = this.entities[this.player.id];
            player.appliedForce.x = 0;
            if(this.keys.keyPressed[keyCodes.left]) player.appliedForce.x -= Settings.player.movementForce;
            if(this.keys.keyPressed[keyCodes.right]) player.appliedForce.x += Settings.player.movementForce;
        }

        for (var id in this.entities) {
            if (this.entities.hasOwnProperty(id)) {
                this.entities[id].update(elapsedTimeSeconds);
                this.handleLocalCollisions(this.entities[id]);

                if(Number(id) === this.player.id) {
                    var hitbox = this.entities[id].getHitbox();
                    var offset = Vector(this.viewBoxOffset.x, this.viewBoxOffset.y);

                    if(hitbox.x < this.viewBoxOffset.x + Settings.window.scroll.x) {
                        offset.x = hitbox.x - Settings.window.scroll.x;
                    }

                    if(hitbox.y < this.viewBoxOffset.y + Settings.window.scroll.y) {
                        offset.y = hitbox.y - Settings.window.scroll.y;
                    }

                    if(hitbox.x + hitbox.width > this.viewBoxOffset.x + Settings.window.width - Settings.window.scroll.x) {
                        offset.x = hitbox.x + hitbox.width - (Settings.window.width - Settings.window.scroll.x);
                    }

                    if(hitbox.y + hitbox.height > this.viewBoxOffset.y + Settings.window.height - Settings.window.scroll.y) {
                        offset.y = hitbox.y + hitbox.height - (Settings.window.height - Settings.window.scroll.y);
                    }

                    this.moveViewport(offset);

                }
            }
        }
    };

    Game.prototype.moveViewport = function(offset) {
        /* this is a hack to fix an issue with js and viewbox */
        this.viewBoxOffset.x = offset.x;
        this.viewBoxOffset.y = offset.y;
        this.playerGroup.attr({
            transform: "translate(" + -offset.x + "," + -offset.y + ")"
        });
        this.backgroundGroup.attr({
            transform: "translate(" + -offset.x + "," + -offset.y + ")"
        });

    };

    Game.prototype.handleLocalCollisions = function(entity) {
        //TODO improve/move
        var box = entity.getHitbox();

        if(box.x < 0) {
            entity.setPosition(Vector(0, box.y));
            box.x = 0;
        }

        if(box.x + box.width > Settings.world.width) {
            entity.setPosition(Vector(Settings.world.width - box.width, box.y));
            box.x = Settings.world.width - box.width;
        }

        if(box.y < 0) {
            entity.setPosition(Vector(box.x, 0));
            box.y = 0;
        }

        if(box.y + box.height > Settings.world.height) {
            entity.setPosition(Vector(box.x, Settings.world.height - box.height));
            entity.onFloor = true;
        }

    };

    Game.prototype.render = function() {

    };

    return Game;
})();
