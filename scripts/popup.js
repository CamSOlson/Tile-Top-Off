var popup;
var popupContent;
var exitButton;

const defaultBackgroundColor = "#33333360";

var tempBoardSize;
var tempObstacleAmount;

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
    setPopup(popupElem)
    popup.classList.remove("hidden");
}

function setPopup(popupElem){
    closeAllPopups();
    popupElem.removeAttribute("hidden");
}

function closeAllPopups(){
    highscorePopup.setAttribute("hidden", true);
    instructionPopup.setAttribute("hidden", true);
    optionsPopup.setAttribute("hidden", true);
}

function closePopup(){
    enableGameInput();
    popup.classList.add("hidden");
}

function showInstructionPopup(){
    showExitButton();
    popup.style.backgroundColor = defaultBackgroundColor;
    showPopup(instructionPopup);
}

function showOptionsPopup(){
    showExitButton();
    popup.style.backgroundColor = defaultBackgroundColor;
    showPopup(optionsPopup);
    updateToggleSwitches();
}

function showHighScorePopup(){
    showExitButton();
    popup.style.backgroundColor = defaultBackgroundColor;
    showPopup(highscorePopup);
    updateHighScoreSpans();
}

function hideExitButton(){
    exitButton.style.visibility = "hidden";
}

function showExitButton(){
    exitButton.style.visibility = "visible";
}