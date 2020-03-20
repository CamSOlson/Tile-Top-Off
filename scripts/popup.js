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

    if (useLocalStorage){
        switch (localStorage.lastPopup){
            default:
                lastPopup = instructionPopup;
                break;
            case "instruction":
                lastPopup = instructionPopup;
                break;
            case "play":
                lastPopup = playPopup;
                break;
            case "highscore":
                lastPopup = highscorePopup;
                break;
            case "option":
                lastPopup = optionsPopup;
                break;
        }
    }
});

function showPopup(popupElem, popupName){
    lastPopup = popupElem;
    lastPopupName = popupName;
    if (useLocalStorage){
        localStorage.lastPopup = popupName;
    }
    disableGameInput();
    setPopup(popupElem);
    popup.classList.remove("hidden");
    if (history.state !== "popup"){
        if (history.state === null){
            history.pushState("popup", popupName, window.location.href);
        }else{
            history.replaceState("popup", popupName, window.location.href);
        }
    }
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

    if (history.state === "popup"){
        history.back();
    }
}

// window.addEventListener("popstate", function(e){
//     if (history.state == "popup"){
//         disableGameInput();
//         if (lastPopup === undefined){
//             setPopup(instructionPopup);
//         }else{
//             setPopup(lastPopup);
//         }
//         popup.classList.remove("hidden");

//     }else{
//         console.log("Closing popup");
//         closePopup();

//     }
// });

function showPlayPopup(){
    showPopup(playPopup, "play");
}

function showInstructionPopup(){
    showPopup(instructionPopup, "instruction");
}

function showOptionsPopup(){
    showPopup(optionsPopup, "option");
    updateToggleSwitches();
}

function showHighScorePopup(){
    showPopup(highscorePopup, "highscore");
    updateHighScoreSpans();
}

function hideExitButton(){
    exitButton.style.visibility = "hidden";
}

function showExitButton(){
    exitButton.style.visibility = "visible";
}