module.exports = (function (){
    var Client = function(connection) {
        this.connection = connection;
    };

    Client.prototype.send = function(m) {
        this.connection.sendUTF(m);
    };

    return Client;
})();
