module.exports = (function (){
    var MessageList = require("./MessageList.js");
    
    return function(id) {
        var Message = {};
        Message.id = id;
        Message.data = MessageList[id]();

        return Message;
    };
})();
