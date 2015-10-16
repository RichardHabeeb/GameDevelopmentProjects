module.exports = (function (){
    window.jQuery = $ = require('jquery');

    var Server = function(uri, connectedCallback) {
        this._websocket = new WebSocket(uri, 'echo-protocol');

        this._websocket.onopen = function(evt) {
            console.log("Connected to " + uri);
            connectedCallback();
        };

        this._websocket.onclose = function(evt) {
            console.log("Disconnected.");
        };

        this._websocket.onmessage = function(evt) {
            console.log(JSON.parse(evt.data));
        };

        this._websocket.onerror = function(evt) {
            console.log(evt);
        };
    };

    Server.prototype.send = function(m) {
        if(this._websocket.readyState === 1) {
            this._websocket.send(JSON.stringify(m));
        } else {
            console.log("Websocket not connected: ", this._websocket.readyState);
        }
    };

    return Server;
})();
