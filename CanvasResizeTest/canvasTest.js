window.onload = function () {
    console.log("Loaded.");
    var numLayersSetting = 1;
    var layers = [];
    var canvasLayers = [];
    for(var i = 0; i < numLayersSetting; i++) {
        var domElement = document.createElement("canvas");
        domElement.setAttribute('width', '128');
        domElement.setAttribute('height', '128');
        layers.push(domElement.getContext('2d'));
        canvasLayers.push(domElement);
        document.body.appendChild(domElement);
    }

    var jelly = new Image();
    jelly.onload = function() {
        layers[0].drawImage(jelly, 0, 0);
    };
    jelly.src = "Jelly.png";

    canvasLayers[0].setAttribute('style', 'width: 512px; height: 512px;');



};
