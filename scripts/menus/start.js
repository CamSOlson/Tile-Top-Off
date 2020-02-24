var tempBoardSize = 5;
var tempObstacleAmount = 0.5;

function toggleStartDropDowns(){
	let dropDowns = document.querySelectorAll("div.start-drop-down");
	for (let dropDown of dropDowns){
		toggleStartDropDown(dropDown);
	}
}
function openStartDropDowns(){
	let dropDowns = document.querySelectorAll("div.start-drop-down");
	for (let dropDown of dropDowns){
		openStartDropDown(dropDown);
	}
}
function closeStartDropDowns(){
	let dropDowns = document.querySelectorAll("div.start-drop-down");
	for (let dropDown of dropDowns){
		closeStartDropDown(dropDown);
	}
}

function toggleStartDropDown(dropDown){
	if (dropDown.classList.contains("open")){
		closeStartDropDown(dropDown);
	}else{
		openStartDropDown(dropDown);
	}
}
function openStartDropDown(dropDown){
	dropDown.classList.add("open");
}
function closeStartDropDown(dropDown){
	dropDown.classList.remove("open");
}

window.addEventListener("load", function(){
	document.querySelector("input#board-size-slider").value = parent.tilesWide;
	document.querySelector("output[for=board-size-slider]").innerHTML = parent.tilesWide;
	document.querySelector("input#path-complexity-slider").value = parent.pathComplexity;
	document.querySelector("output[for=path-complexity-slider]").innerHTML = parent.pathComplexity;
	
	tempBoardSize = document.querySelector("input#board-size-slider").value;
	tempObstacleAmount = document.querySelector("input#path-complexity-slider").value;
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
	setPathComplexity(tempObstacleAmount);
}