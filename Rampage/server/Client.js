module.exports = (function (){
    var Message = require("../messages/Message.js");
    var Player = require("./Player.js");

    var Client = function(connection) {
        this.connection = connection;
        this.player = new Player(this);
    };

    Client.prototype.send = function(m) {
        this.connection.sendUTF(JSON.stringify(m));
    };

    Client.prototype.setId = function(id) {
        var m = Message("InformId");
        this.id = id;
        m.data.id = id;
        this.send(m);
    };

    return Client;
})();
