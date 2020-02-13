var tempBoardSize = 5;
var tempObstacleAmount = 0.5;

window.addEventListener("load", function(){
	document.querySelector("input#board-size-slider").value = parent.tilesWide;
	document.querySelector("output[for=board-size-slider]").innerHTML = parent.tilesWide;
	document.querySelector("input#path-complexity-slider").value = parent.pathComplexity;
	document.querySelector("output[for=path-complexity-slider]").innerHTML = parent.pathComplexity;
	
	tempBoardSize = document.querySelector("input#board-size-slider").value;
	tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
});

function applyOptions(){
	document.querySelector("main").contentWindow.applyOptions();
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
	parent.setBoardSize(tempBoardSize);
	parent.setPathComplexity(tempObstacleAmount);
	parent.loadGame();
	parent.closePopup();
}