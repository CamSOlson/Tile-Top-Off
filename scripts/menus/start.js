var tempBoardSize = 5;
var tempObstacleAmount = 0.5;

window.addEventListener("load", function() {
	tempBoardSize = customBoardSize;
	tempObstacleAmount = customPathComplexity;

	document.querySelector("input#board-size-slider").value = Number(tempBoardSize);
	document.querySelector("output[for=board-size-slider]").innerHTML = Number(tempBoardSize);
	document.querySelector("input#path-complexity-slider").value = Number(tempObstacleAmount).toFixed(2);
	document.querySelector("output[for=path-complexity-slider]").innerHTML = Number(tempObstacleAmount).toFixed(2);
});

function onBoardSizeSliderInput(){
	tempBoardSize = document.querySelector("input#board-size-slider").value;
	document.querySelector("output[for=board-size-slider]").innerHTML = Number(tempBoardSize);
}

function onObstacleSliderInput(){
	tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
	document.querySelector("output[for=path-complexity-slider]").innerHTML = Number(tempObstacleAmount).toFixed(2);
}

function applyCustomOptions(){
	setBoardSize(tempBoardSize);
	setCustomBoardSize(tempBoardSize);
	setPathComplexity(tempObstacleAmount);
	setCustomPathComplexity(tempObstacleAmount);
}