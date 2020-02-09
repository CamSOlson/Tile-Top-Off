var popup;
var popupContent;

var tempBoardSize;
var tempObstacleAmount;

window.addEventListener("load", function(e){
    popup = document.querySelector("section#popup");
    popupContent = document.querySelector("iframe#popup-content");
});

function showPopup(content){
    disableGameInput();
    popupContent.src = content;
    popup.classList.remove("hidden");
}

function closePopup(){
    enableGameInput();
    popup.classList.add("hidden");
}

function showInstructionPopup(){
    showPopup("/menus/instructions.html");
}

function showOptionsPopup(){
    showPopup("/menus/options.html");
}
