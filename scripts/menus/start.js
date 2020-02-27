var tempBoardSize = 5;
var tempObstacleAmount = 0.5;

window.addEventListener("load", function() {
	tempBoardSize = customBoardSize;
	tempObstacleAmount = customPathComplexity;

	document.querySelector("input#board-size-slider").value = tempBoardSize;
	document.querySelector("output[for=board-size-slider]").innerHTML = tempBoardSize;
	document.querySelector("input#path-complexity-slider").value = parent.tempObstacleAmount;
	document.querySelector("output[for=path-complexity-slider]").innerHTML = tempObstacleAmount;
});

function onBoardSizeSliderInput(){
	tempBoardSize = document.querySelector("input#board-size-slider").value;
	document.querySelector("output[for=board-size-slider]").innerHTML = tempBoardSize;
}

function onObstacleSliderInput(){
	tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
	document.querySelector("output[for=path-complexity-slider]").innerHTML = tempObstacleAmount;
}

function applyCustomOptions(){
	setBoardSize(tempBoardSize);
	setCustomBoardSize(tempBoardSize);
	setPathComplexity(tempObstacleAmount);
	setCustomPathComplexity(tempObstacleAmount);
}