module.exports = (function (){
    window.jQuery = $ = require('jquery');

    var Server = function(uri, connectedCallback) {
        this._websocket = new WebSocket(uri, 'echo-protocol');
        /* closure reference is to fix the javascript "this" in callbacks */
        var eventHandlers = this._eventHandlers = {};

        this._websocket.onopen = function(evt) {
            console.log("Connected to " + uri);
            connectedCallback();
        };

        this._websocket.onclose = function(evt) {
            console.log("Disconnected.");
        };

        this._websocket.onmessage = function(evt) {
            var message = JSON.parse(evt.data);
            if(typeof message.id !== "undefined" && message.id in eventHandlers) {
                for(var i = 0; i < eventHandlers[message.id].length; i++) {
                    eventHandlers[message.id][i](message.data);
                }
            } else {
                console.log("Dropped message: ", message);
            }
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

    Server.prototype.addMessageHandler = function(messageId, handler) {
        if(!(messageId in this._eventHandlers)) {
            this._eventHandlers[messageId] = [];
        }
        this._eventHandlers[messageId].push(handler);
    };

    Server.prototype.removeMessageHandler = function(messageId, handler) {
        if(messageId in this._eventHandlers) {
            var handlerIndex = this._eventHandlers[messageId].indexOf(handler);
            if(handlerIndex > -1) {
                this._eventHandlers[messageId].splice(handlerIndex, 1);
            }
        }
    };

    return Server;
})();
