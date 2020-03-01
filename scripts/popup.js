var popup;
var popupContent;
var exitButton;

const defaultBackgroundColor = "#33333360";

var tempBoardSize;
var tempObstacleAmount;

var playPopup;
var highscorePopup;
var instructionPopup;
var optionsPopup;

var lastPopup;
var lastPopupName;

window.addEventListener("load", function(e){
    popup = document.querySelector("section#popup");
    popupContent = document.querySelector("section#popup-content");
    exitButton = document.querySelector("a#exit-popup");

    highscorePopup = document.querySelector("section#popup-content>section#highscore-content");
    instructionPopup = document.querySelector("section#popup-content>section#instruction-content");
    optionsPopup = document.querySelector("section#popup-content>section#options-content");
    playPopup = document.querySelector("section#popup-content>section#play-content");

    popup.style.backgroundColor = defaultBackgroundColor;
    showExitButton();
    closeAllPopups();
});

function showPopup(popupElem, popupName){
    lastPopup = popupElem;
    lastPopupName = popupName;
    disableGameInput();
    setPopup(popupElem);
    popup.classList.remove("hidden");
    history.pushState("popup", popupName, window.location.href);
}

function setPopup(popupElem){
    closeAllPopups();
    popupElem.style.display = "";
}

function closeAllPopups(){
    playPopup.style.display = "none";
    highscorePopup.style.display = "none";
    instructionPopup.style.display = "none";
    optionsPopup.style.display = "none";
}

function closePopup(){
    enableGameInput();
    popup.classList.add("hidden");
}

function closePopupState(){
    window.history.back();
    closePopup();
}

window.addEventListener("popstate", function(e){
    if (history.state != "popup"){
        closePopup();
    }else{
        disableGameInput();
        setPopup(lastPopup);
        popup.classList.remove("hidden");
    }
});

function showPlayPopup(){
    showPopup(playPopup, "Play");
}

function showInstructionPopup(){
    showPopup(instructionPopup, "Instructions");
}

function showOptionsPopup(){
    showPopup(optionsPopup, "Options");
    updateToggleSwitches();
}

function showHighScorePopup(){
    showPopup(highscorePopup, "Highscores");
    updateHighScoreSpans();
}

function hideExitButton(){
    exitButton.style.visibility = "hidden";
}

function showExitButton(){
    exitButton.style.visibility = "visible";
}