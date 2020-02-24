var popup;
var popupContent;
var exitButton;

const defaultBackgroundColor = "#33333360";

var tempBoardSize;
var tempObstacleAmount;

window.addEventListener("load", function(e){
    popup = document.querySelector("section#popup");
    popupContent = document.querySelector("iframe#popup-content");
    exitButton = document.querySelector("a#exit-popup");
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
    showExitButton();
    popup.style.backgroundColor = defaultBackgroundColor;
    showPopup("/menus/instructions.html");
}

function showOptionsPopup(){
    showExitButton();
    popup.style.backgroundColor = defaultBackgroundColor;
    showPopup("/menus/options.html");
}

function hideExitButton(){
    exitButton.style.visibility = "hidden";
}

function showExitButton(){
    exitButton.style.visibility = "visible";
}