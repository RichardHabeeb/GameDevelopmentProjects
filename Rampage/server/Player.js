module.exports = (function (){
    var Rect = require("../common/Rect.js");
    var Settings = require("../common/Settings.js");
    var Message = require("../messages/Message.js");
    var colors = ["#000", "#F00", "#0F0", "#00F"];

    var Player = function(client) {
        this.client = client;
        this.color = colors[Math.floor(Math.random()*colors.length)];
        this.hitbox = Rect(0, 0, Settings.player.width, Settings.player.height);
        this.next = null;
        this.prev = null;
    };

    Player.prototype.getUpdate = function() {
        var m = Message("UpdatePlayer");
        m.data.id = this.client.id;
        m.data.x = this.hitbox.x;
        m.data.y = this.hitbox.y;
        m.data.width = this.hitbox.width;
        m.data.height = this.hitbox.height;
        m.data.color = this.color;
        return m;
    };

    Player.prototype.recieveUpdate = function(m) {
        this.hitbox.x = m.data.x;
        this.hitbox.y = m.data.y;
        this.hitbox.width = m.data.width;
        this.hitbox.height = m.data.height;
        this.color = m.data.color;
    };

    return Player;
})();
