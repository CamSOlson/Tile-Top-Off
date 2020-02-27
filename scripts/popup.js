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

// function fetchHTMLData(file, callback){
//     let xhr = new XMLHttpRequest();
//     xhr.open("GET", file, true);
//     xhr.onreadystatechange = function() {
//         if (this.readyState === 4) {
//             callback(this.responseText);
//         }
//     };
//     xhr.send();
// }

function showPopup(popupElem){
    disableGameInput();
    setPopup(popupElem);
    popup.classList.remove("hidden");
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

function showPlayPopup(){
    showPopup(playPopup);
}

function showInstructionPopup(){
    showPopup(instructionPopup);
}

function showOptionsPopup(){
    showPopup(optionsPopup);
    updateToggleSwitches();
}

function showHighScorePopup(){
    showPopup(highscorePopup);
    updateHighScoreSpans();
}

function hideExitButton(){
    exitButton.style.visibility = "hidden";
}

function showExitButton(){
    exitButton.style.visibility = "visible";
}