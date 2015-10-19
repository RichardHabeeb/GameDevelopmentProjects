module.exports = (function (){
    var UpdatePlayer = require("./UpdatePlayer.js");
    var InformId = require("./InformId.js");
    var InformMap = require("./InformMap.js");
    var RemovePlayer = require("./RemovePlayer.js");

    return {
        "UpdatePlayer": UpdatePlayer,
        "InformId": InformId,
        "InformMap": InformMap,
        "RemovePlayer": RemovePlayer,
    };
})();
