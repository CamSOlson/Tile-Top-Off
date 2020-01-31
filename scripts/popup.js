var popup;
var popupContent;

var tempBoardSize;
var tempObstacleAmount;

window.addEventListener("load", function(e){
    popup = document.querySelector("section#popup");
    popupContent = document.querySelector("div#popup-content");
});

function showPopup(content){
    disableGameInput();
    popupContent.innerHTML = content;
    popup.classList.remove("hidden");
}

function closePopup(){
    enableGameInput();
    popup.classList.add("hidden");
}

function showOptionsPopup(){
    showPopup(  "<h1>Options</h1>" + 
                "<div class='slider-container'>" +
                    "<label for='board-size-slider'>Board Size</label>" +
                    "<input type='range' min='2' max='10' value='5' class='slider' id='board-size-slider' oninput='onBoardSizeSliderInput()'>" +
                    "<output name='board-size' for='board-size-slider'></output>" +
                "</div>" +
                "<div class='slider-container'>" +
                    "<label for='path-complexity-slider'>Path Complexity</label>" +
                    "<input type='range' min='0.05' max='0.70' value='0.5' step='0.01' class='slider' id='path-complexity-slider' oninput='onObstacleSliderInput()'>" +
                    "<output name='path-complexity' for='path-complexity-slider'></output>" +
                "</div>" +
                "<button id='apply-options' onclick='applyOptions()'>Apply</button>");

    document.querySelector("input#board-size-slider").value = tilesWide;
    document.querySelector("output[for=board-size-slider]").innerHTML = tilesWide;
    document.querySelector("input#path-complexity-slider").value = pathComplexity;
    document.querySelector("output[for=path-complexity-slider]").innerHTML = pathComplexity;

    tempBoardSize = document.querySelector("input#board-size-slider").value;
    tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
}

function onBoardSizeSliderInput(){
    tempBoardSize = document.querySelector("input#board-size-slider").value;
    document.querySelector("output[for=board-size-slider]").innerHTML = tempBoardSize;
}

function onObstacleSliderInput(){
    tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
    document.querySelector("output[for=path-complexity-slider]").innerHTML = tempObstacleAmount;

}

function applyOptions(){
    setBoardSize(tempBoardSize);
    setPathComplexity(tempObstacleAmount);
    loadGame();
    closePopup();
}
