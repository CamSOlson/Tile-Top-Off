var tileSize = "100%";

var tilesWide = 5;
var customBoardSize = 5;
var tilesTall = 5;
var obstacles = 0;
var tilesFilled = 0;
var pathComplexity = 0.5;
var customPathComplexity = 0.5;

var tiles = [[]];
var pastMoves = [[]];
var undoDirection = -1;
var undos;
var playerTile;
var startPos;
var path;

var defaultTileColor = "#00000000";
var obstacleTileColor = "#888888";
var playerColors = ["#ff2626", "#ff9326", "#ffff00", "#00ff40", "#0080ff", "#9326ff", "#ff73ff"];
var playerTileColor = playerColors[0];

var statusDiv;
var statusMain;
var statusSub;
var tileDiv;

var difficulty;
var score = 0;
var highScoreEasy = 0;
var highScoreNorm = 0;
var highScoreHard = 0;

var gameOver = false;
var transition = false;
var starting = true;
var blockInput = false;
var vibration = true;

var mainGame;
var gameBoard;
var holdIndicator;
var startScreen;
var difficultySpan;
var scoreSpan;
var undoSpan;

window.addEventListener("load", function(){
	mainGame = document.querySelector("main#game");
	gameBoard = document.querySelector("section#board");
	statusDiv = document.querySelector("div#status");
	statusMain = document.querySelector("p#statusMain");
	statusSub = document.querySelector("p#statusSub");
	tileDiv = document.querySelector("div#tiles");
	holdIndicator = document.querySelector("div#hold-indicator");
	startScreen = document.querySelector("section#start-screen");
	difficultySpan = document.querySelector("label#game-label>span#difficulty");
	scoreSpan = document.querySelector("label#game-label>span#score");
	undoSpan = document.querySelector("label#game-label>span#undo");

	initLocalStorage();

	window.addEventListener("keydown", function(e){
		e = e || window.event;
		update(e.keyCode);
	});
	
	gameBoard.addEventListener("click", function(e){
		let rect = gameBoard.getBoundingClientRect();
		let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		
		touchMove(gameBoard, e.clientX - rect.left - scrollLeft, e.clientY - rect.top - scrollTop);
	});

	swipeMovement(mainGame, function(swipeDir, held){
        if (swipeDir != "none"){
            switch (swipeDir){
				case "up":
					update(38, held);
					break;
				case "down":
					update(40, held);
					break;
				case "left":
					update(37, held);
					break;
				case "right":
					update(39, held);
					break;
			}
        }
	});
	
	showStartScreen();
});

function showStartScreen(){
	starting = true;
	startScreen.classList.remove("hidden");
}

function hideStartScreen(){
	starting = false;
	startScreen.classList.add("hidden");
}

function beginGame(){
	starting = false;
	gameOver = false;
	score = 0;
	scoreSpan.innerHTML = 0;
	switch (difficulty){
		default:
			difficultySpan.innerHTML = "Custom";
			break;
		case 0:
			difficultySpan.innerHTML = "Easy";
			break;
		case 1:
			difficultySpan.innerHTML = "Normal";
			break;
		case 2:
			difficultySpan.innerHTML = "Hard";
			break;
	}
	loadGame();
	hideStatus();
	closePopup();
	hideStartScreen();
}

function loadGame(){		
	pastMoves = [[]];
	generateTiles();
}

function resetGame(){
	//Set all used and player tiles to empty tiles
	for (let x = 0; x < tiles.length; x++){
		for (let y = 0; y < tiles[x].length; y++){
			if (tiles[x][y].dataset.tiletype === "used" || tiles[x][y].dataset.tiletype === "player"){
				tiles[x][y].dataset.tiletype = "empty";
				tiles[x][y].style.backgroundColor = defaultTileColor;
			}
		}
	}
	//Set the tile at the starting position to the player tile
	tiles[startPos[0]][startPos[1]].dataset.tiletype = "player";
	tiles[startPos[0]][startPos[1]].style.backgroundColor = playerTileColor;
	playerTile = tiles[startPos[0]][startPos[1]];
	tilesFilled = 0;
	//Turn off any state variables
	blockInput = false;
	gameOver = false;
	transition = false;
	starting = false;
	pastMoves = [[]];
	resetUndo();
	hideStatus();
}

function resetUndo(){
	undoDirection = -1;
	undos = Math.round(tilesWide / 2) - 1;
	undoSpan.innerHTML = undos;
}

function setDifficulty(dif){
	difficulty = dif;
	switch (difficulty){
		case 0:
			//Easy
			setPathComplexity(0.6);
			setBoardSize(4);

			break;
		case 1:
			setPathComplexity(0.6);
			setBoardSize(5);

			break;
		case 2:
			setPathComplexity(0.7);
			setBoardSize(6);

			break;
	}
}

function setBoardSize(size){
	tilesWide = size;
	tilesTall = size;
}

function setCustomBoardSize(size){
	customBoardSize = size;
	if (useLocalStorage){
		localStorage.customBoardSize = size;
	}
}

function setPathComplexity(amount){
	pathComplexity = amount;
}

function setCustomPathComplexity(complexity){
	customPathComplexity = complexity;
	if (useLocalStorage){
		localStorage.customPathComplexity = complexity;
	}
}

function updateScore(currentScore, currentDifficulty){
	scoreSpan.innerHTML = currentScore;
	switch (currentDifficulty){
		case 0:
			//Easy
			if (useLocalStorage && score > Number(localStorage.highScoreEasy)){
				localStorage.highScoreEasy = currentScore;
			}
			highScoreEasy = currentScore;
			break;
		case 1:
			//Normal
			if (useLocalStorage && score > Number(localStorage.highScoreNorm)){
				localStorage.highScoreNorm = currentScore;
			}
			highScoreNorm = currentScore;
			break;
		case 2:
			//Hard
			if (useLocalStorage && score > Number(localStorage.highScoreHard)){
				localStorage.highScoreHard = currentScore;
			}
			highScoreHard = currentScore;
			break;
	}
}

function setVibration(enabled){
	vibration = enabled;
	if (useLocalStorage){
		localStorage.vibration = enabled;
	}
}

function getAdjacentTiles(x, y){
	x = parseInt(x, 10);
	y = parseInt(y, 10);
	let adjTiles = [];
	//Above
	if (y > 0){
		adjTiles.push(tiles[x][y - 1]);
	}else{
		adjTiles.push(undefined);
	}
		//Right
		if (x < tilesWide - 1){
			adjTiles.push(tiles[x + 1][y]);
		}else{
			adjTiles.push(undefined);
		}
			//Below
	if (y < tilesTall - 1){
		adjTiles.push(tiles[x][y + 1]);
	}else{
		adjTiles.push(undefined);
	}
		//Left
		if (x > 0){
			adjTiles.push(tiles[x - 1][y]);
		}else{
			adjTiles.push(undefined);
		}



	return adjTiles;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function touchMove(element, x, y){
	//check if closer to x or y axis
	if (Math.abs(y - element.offsetHeight / 2) > Math.abs(x - element.offsetWidth / 2)){
		//Closer to y axis
		if (y > element.offsetHeight / 2){
			//down
			update(40);
		}else{
			update(38);
		}
	}else{
		//Closer to x axis
		if (x > element.offsetWidth / 2){
			//right
			update(39);
		}else{
			//left
			update(37);
		}
	}
}

function update(key, shift){
	if (!shift){
		if (window.event !== undefined){
			shift = window.event.shiftKey;
		}
	}
	if (!blockInput){
		if (gameOver && !transition){
			if (key == "38" || key == "40" || key == "37" || key == "39" || key == "87" || key == "83" || key == "65" || key == "68") {
				showStartScreen();
				gameOver = false;
			}
		}else if (!transition && !starting){
			//Check movements
			if (key == "38" || key == "87") {
				//UP
				if (undos > 0 && undoDirection === 0){
					undoLastMove();
				}else{
					move(0, shift);
				}
			}
			else if (key == "39" || key == "68") {
				//RIGHT
				if (undos > 0 && undoDirection === 1){
					undoLastMove();
				}else{
					move(1, shift);
				}
			}
			else if (key == "40" || key == "83") {
				//DOWN
				if (undos > 0 && undoDirection === 2){
					undoLastMove();
				}else{
					move(2, shift);
				}
			}
			else if (key == "37" || key == "65") {
				//LEFT
				if (undos > 0 && undoDirection === 3){
					undoLastMove();
				}else{
					move(3, shift);
				}
			}

			setUndoDirection();
			
			//Check if the player is at a dead end
			if (atDeadEnd()){
				if (checkWinState()){
					transition = true;
					score++;
					updateScore(score, difficulty);
					fadeToNewStage();
					generateTiles();
					transition = false;
					if ("vibrate" in window.navigator && vibration){
						window.navigator.vibrate(250);
					}
				}else{
					gameOver = true;
					showStatus("GAME OVER", "#FF0000", "Stages complete: " + score + "<br><br>Move to continue...", "#FFC8C8", "rgba(0.5, 0.5, 0.5, 0.5)");
					updateScore(score, difficulty);
					score = 0;
					if ("vibrate" in window.navigator && vibration){
						window.navigator.vibrate(500);
					}
				}
			}
		}
	}
	undoSpan.innerHTML = undos;
}

function setUndoDirection(){
	undoDirection = -1;
	let prevMove = pastMoves[pastMoves.length - 1];
	if (prevMove !== undefined){
		prevMove = prevMove[0].split(", ");
		let prevPos = [Number(prevMove[0]), Number(prevMove[1])];
		let playerPos = [Number(playerTile.dataset.x), Number(playerTile.dataset.y)];
		if (prevPos[0] > playerPos[0]){
			//Right
			undoDirection = 1;
		}else if (prevPos[0] < playerPos[0]){
			//Left
			undoDirection = 3;
		}else if (prevPos[1] > playerPos[1]){
			//Down
			undoDirection = 2;
		}else{
			//Up
			undoDirection = 0;
		}
	}
	
}

function undoLastMove(){
	let undoFullMove = false;
	let undoID = -1;
	undos--;
	do {
		if (undoID === -1 || undoID === pastMoves[pastMoves.length - 1][1]){
			let lastMove = pastMoves.pop();

			//Determine if full move
			undoFullMove = lastMove[2];	
			let lastMoveRaw = lastMove[0].split(", ");
			let lastPos = [Number(lastMoveRaw[0]), Number(lastMoveRaw[1])];

			let prevTile = tiles[lastPos[0]][lastPos[1]];
			prevTile.dataset.tiletype = "empty";
			prevTile.style.backgroundColor = defaultTileColor;
			prevTile.style.backgroundImage = "none";

			switchTiles(prevTile, playerTile);

			tilesFilled--;

			undoID = lastMove[1];
		}else{
			undoFullMove = false;
		}
	} while (undoFullMove);
}

function fadeToNewStage(){
	let cloneBoard = tileDiv.cloneNode(true);
	cloneBoard.setAttribute("id", "fade-board");
	tileDiv.focus();
	gameBoard.appendChild(cloneBoard);
	setTimeout(function(){cloneBoard.classList.add("fade-out");}, 5);
	setTimeout(function(){cloneBoard.parentNode.removeChild(cloneBoard);}, 505);
}

function toggleGameInput(){
	blockInput = !blockInput;
}

function enableGameInput(){
	blockInput = false;
}

function disableGameInput(){
	blockInput = true;
}

function move(direction, allTheWay){
	let moveID = pastMoves.length;
	do {
		let adjacentTiles = getAdjacentTiles(playerTile.dataset.x, playerTile.dataset.y);
		if (adjacentTiles[direction] !== undefined){
			let fullMove = allTheWay;
			let playerMoved = movePlayer(playerTile, adjacentTiles[direction]);
			allTheWay = playerMoved && allTheWay;
			if (playerMoved){
				pastMoves.push([adjacentTiles[direction].dataset.x + ", " + adjacentTiles[direction].dataset.y, moveID, fullMove]);
			}
		}else{
			allTheWay = false;
		}
	} while (allTheWay);
}

function movePlayer(playerTile, targetTile){
	//Make sure target is empty
	if (targetTile.dataset.tiletype === "empty"){
		tilesFilled++;
		//Switch tiles
		switchTiles(playerTile, targetTile);
		//Set other tile to a "used" tile
		targetTile.dataset.tiletype = "used";

		let fromColor = getUsedTileColor(tilesFilled);
		let toColor = getUsedTileColor(tilesFilled + 1);
		let playerPos = [Number(playerTile.dataset.x), Number(playerTile.dataset.y)];
		let currPos = [Number(targetTile.dataset.x), Number(targetTile.dataset.y)];
		if (playerPos[0] > currPos[0]){
			//Right
			toSide = 1;
		}else if (playerPos[0] < currPos[0]){
			//Left
			toSide = 3;
		}else if (playerPos[1] > currPos[1]){
			//Down
			toSide = 2;
		}else{
			//Up
			toSide = 0;
		}
		let prevMove = pastMoves[pastMoves.length - 1];
		let fromSide = 0;
		let toSize = 0;
		let gradient;
		if (prevMove !== undefined){
			//Middle of path
			prevMove = prevMove[0].split(", ");
			let prevPos = [Number(prevMove[0]), Number(prevMove[1])];


			if (prevPos[0] > currPos[0]){
				//Right
				fromSide = 1;
			}else if (prevPos[0] < currPos[0]){
				//Left
				fromSide = 3;
			}else if (prevPos[1] > currPos[1]){
				//Down
				fromSide = 2;
			}else{
				//Up
				fromSide = 0;
			}

			gradient = createGradient(fromSide, toSide, fromColor, toColor);
		}else{
			//Beginning of path
			fromSide = toSide - 2;
			while (fromSide < 0){
				fromSide += 4;
			}
			gradient = createGradient(fromSide, toSide, fromColor, toColor);
		}

		targetTile.style.backgroundColor = getUsedTileColor(tilesFilled);
		//targetTile.style.backgroundImage = "conic-gradient(at 100% 0%, Red 50%, Blue 75%)";
		targetTile.style.backgroundImage = gradient;
		return true;
	}else{
		return false;
	}
}

function createGradient(fromSide, toSide, fromColor, toColor){
	switch (fromSide){
		case 0:
			//From top
			switch (toSide){
				case 1:
					//To right
					return "conic-gradient(at 100% 0%, " + toColor + " 50%, " + fromColor + " 75%)";
				case 2:
					//To bottom
					return "linear-gradient(to bottom, " + fromColor + ", " + toColor + ")";
				case 3:
					//To left
					return "conic-gradient(at 0% 0%, " + fromColor + " 25%, " + toColor + " 50%)";
			}
			break;
		case 1:
			//From right
			switch (toSide){
				case 0:
					//To top
					return "conic-gradient(at 100% 0%, " + fromColor + " 50%, " + toColor + " 75%)";
				case 2:
					//To bottom
					return "conic-gradient(at 100% 100%, " + toColor + " 75%, " + fromColor + " 100%)";
				case 3:
					//To left
					return "linear-gradient(to left, " + fromColor + ", " + toColor + ")";
			}
			break;
		case 2:
			//From bottom
			switch (toSide){
				case 0:
					//To top
					return "linear-gradient(to top, " + fromColor + ", " + toColor + ")";
				case 1:
					//To right
					return "conic-gradient(at 100% 100%, " + fromColor + " 75%, " + toColor + " 100%)";
				case 3:
					//To left
					return "conic-gradient(at 0% 100%, " + toColor + " 0%, " + fromColor + " 25%)";
			}
			break;
		case 3:
			//From left
			switch (toSide){
				case 0:
					//To top
					return "conic-gradient(at 0% 0%, " + toColor + " 25%, " + fromColor + " 50%)";
				case 1:
					//To right
					return "linear-gradient(to right, " + fromColor + ", " + toColor + ")";
				case 2:
					//To bottom
					return "conic-gradient(at 0% 100%, " + fromColor + " 0%, " + toColor + " 25%)";
			}
			break;
	}
	return "linear-gradient(" + fromColor + ", " + toColor + ")";
}

function getUsedTileColor(moveNumber){
	let max = tilesWide * tilesTall - obstacles;
	let percentage = moveNumber / max;
	percentage = percentage / 2 + 0.5;
	let rgb = hexToRGB(playerTileColor);
	return "rgba(" + Math.min(255, (percentage * rgb.r) * 0.75) + ", " + Math.min(255, (percentage * rgb.g) * 0.75) + ", " + Math.min(255, (percentage * rgb.b) * 0.75) + ", 255)";
}

function hexToRGB(hex) {
	let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result ? {
		r: parseInt(result[1], 16),
		g: parseInt(result[2], 16),
		b: parseInt(result[3], 16)
	}: null;
}

function switchTiles(tile1, tile2){
	let t1x = tile1.dataset.x;
	let t1y = tile1.dataset.y;
	let t1top = tile1.style.top;
	let t1left = tile1.style.left;

	tile1.dataset.x = tile2.dataset.x;
	tile1.dataset.y = tile2.dataset.y;
	tile1.style.top = tile2.style.top;
	tile1.style.left = tile2.style.left;
	tiles[t1x][t1y] = tile2;

	tiles[tile2.dataset.x][tile2.dataset.y] = tile1;
	tile2.dataset.x = t1x;
	tile2.dataset.y = t1y;
	tile2.style.top = t1top;
	tile2.style.left = t1left;
	
	// tiles[tile1.dataset.x][tile1.dataset.y] = tile1;
	// tiles[tile2.dataset.x][tile2.dataset.y] = tile2;
}

function atDeadEnd(){
	for (let tile of getAdjacentTiles(playerTile.dataset.x, playerTile.dataset.y)){
		//If any adjacent tile is empty, return false since there is at least one more move
		if (tile !== undefined && tile.dataset.tiletype === "empty"){
			return false;
		}
	}
	return true;
}

function checkWinState(){
	//Return if any tile is empty, otherwise return true
	for (let x = 0; x < tilesWide; x++){
		for (let y = 0; y < tilesTall; y++){
			if (tiles[x][y].dataset.tiletype === "empty"){
				return false;
			}
		}
	}
	return true;
}

function showStatus(message, messageColor, sub, subColor, backgroundColor){
	statusMain.innerHTML = message;
	statusMain.style.color = messageColor;
	statusSub.innerHTML = sub;
	statusSub.style.color = subColor;
	statusDiv.style.backgroundColor = backgroundColor;
	statusDiv.classList.remove("status-hidden");
	statusDiv.classList.add("status-shown");
	statusMain.classList.remove("status-hidden");
	statusMain.classList.add("status-shown");
	statusSub.classList.remove("status-hidden");
	statusSub.classList.add("status-shown");
}
function hideStatus(){
	statusMain.innerHTML = "";
	statusSub.innerHTML = "";
	statusDiv.classList.remove("status-shown");
	statusDiv.classList.add("status-hidden");
	statusMain.classList.remove("status-shown");
	statusMain.classList.add("status-hidden");
	statusSub.classList.remove("status-shown");
	statusSub.classList.add("status-hidden");
}

function swipeMovement(element, callback){
	let touchElem = element;
	let swipeDir, startX, startY, distX, distY, 
	threshold = 50, //min dist
    restraint = 50, //max deviation
	allowedTime = 300, //max time
	holdTime = 250, //Time to hold for full move
	holdThreshold = 10, //Num of pixels user can move while counting as holding
	holdSwipeEvent, holdSwipe = false, elapsedTime, startTime,
    swipeEvent = callback || function(swipeDir, held){};
  
    touchElem.addEventListener("touchstart", function(e){
        let touchobj = e.changedTouches[0];
        swipeDir = "none";
        dist = 0;
        startX = touchobj.pageX;
		startY = touchobj.pageY;
		distX = 0;
		distY = 0;
		startTime = new Date().getTime();
		holdSwipeEvent = setTimeout(function(){
			holdSwipe = true;
			holdIndicator.classList.add("active");
		}, holdTime);
		updateHoldIndicator();
		holdSwipe = false;
    }, {passive: true});
  
    touchElem.addEventListener("touchmove", function(e){
		e.preventDefault();

		var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;

		updateHoldIndicator();

		if (Math.sqrt(Math.pow(distX, 2) + Math.pow(distY, 2)) > holdThreshold){
			if (holdSwipe){
				startTime = new Date().getTime();
			}else{
				clearTimeout(holdSwipeEvent);
				holdIndicator.classList.remove("active");
				holdSwipe = false;
			}
		}
	});
  
    touchElem.addEventListener("touchend", function(e){
		clearTimeout(holdSwipeEvent);
		holdIndicator.classList.remove("active");
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
		elapsedTime = new Date().getTime() - startTime;
		updateHoldIndicator();
		if (elapsedTime <= allowedTime){
			if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
				swipeDir = (distX < 0)? "left" : "right";
			}
			else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
				swipeDir = (distY < 0)? "up" : "down";
			}
		}	
		swipeEvent(swipeDir, holdSwipe);
		holdSwipe = false;
	}, {passive: true});

	function updateHoldIndicator(){
		holdIndicator.style.transform = "translate(" + (startX + distX) + "px, " + (startY + distY) + "px)";
	}
}

//Tile generator

function generateTiles() {
	tilesTall = tilesWide;
	tilesFilled = 0;
	tileSize = (100 / tilesWide);
	resetUndo();
	
	let prevColor = playerTileColor;
	while (playerTileColor == prevColor){
		playerTileColor = playerColors[getRandomInt(playerColors.length)];
	}
	let playerInstruction = document.querySelector("span#player-instructions");
	if (playerInstruction != null){
		playerInstruction.style.color = playerTileColor;
	}
	
	let boardColumns = "";
	let boardRows = "";
	
	//Clear board
	tileDiv.innerHTML = "";
	tiles = [];
	pastMoves = [];
	//Populate game board with tiles. Iterate through tile width and height
	for (let x = 0; x < tilesWide; x++){
		boardColumns += " " + tileSize;
		let col = [];
		for (let y = 0; y < tilesTall; y++){
			let tile = document.createElement("a");
			tile.classList.add("tile");
			tile.dataset.x = x;
			tile.dataset.y = y;
			tileDiv.appendChild(tile);	
			tile.style.left = (tileSize * x) + "%";
			tile.style.top = (tileSize * y) + "%";
			tile.style.width = (Number(tileSize) + 0.01) + "%";
			tile.style.height = (Number(tileSize) + 0.01) + "%";

			col.push(tile);
		}
		tiles[x] = col;
	}
	//tiles.pop();
	
	//Make the styling rule for the columns since it was too messy to do before
	for (let y = 0; y < tilesTall; y++){
		boardRows += " " + tileSize;
	}
	//Reset all tiles to obstacle tiles
	for (let x = 0; x < tiles.length; x++){
		for (let y = 0; y < tiles[x].length; y++){
			tiles[x][y].dataset.tiletype = "obstacle";
			tiles[x][y].style.backgroundColor = obstacleTileColor;
		}
	}
	
	//Generate a random location for the player tile
	let x = getRandomInt(tilesWide - 1);
	let y = getRandomInt(tilesTall - 1);
	tiles[x][y].dataset.tiletype = "player";
	tiles[x][y].style.backgroundColor = playerTileColor;
	playerTile = tiles[x][y];
	startPos = [x, y];
	//Make random moves to empty spaces until there are no moves to make.
	let visitedMap = [[]];
	for (let i = 0; i < tilesWide; i++){
		visitedMap[i] = [];
		for (let i2 = 0; i2 < tilesTall; i2++){
			visitedMap[i][i2] = false;
		}
	}
	visitedMap[x][y] = true;
	let tilesGenerated = 0;
	let pathSequence = [[x, y]];
	let invalidMoves = {};
	let restart = false;
	let timeElapsed = 0;
	while (tilesGenerated < Math.round((tilesWide * tilesTall) * Math.min(1, pathComplexity))) {
		let startTime = new Date();
		let currentMap = obstacleMapToString(visitedMap);
		let invalidDirections = invalidMoves[currentMap];
		let openDirections = [y - 1 >= 0 && visitedMap[x][y - 1] === false && (invalidDirections === undefined ? true : !invalidDirections.includes(x + "," + (y - 1))),
			y + 1 < tilesTall && visitedMap[x][y + 1] === false && (invalidDirections === undefined ? true : !invalidDirections.includes(x + "," + (y + 1))),
			x - 1 >= 0 && visitedMap[x - 1][y] === false && (invalidDirections === undefined ? true : !invalidDirections.includes((x - 1) + "," + y)),
			x + 1 < tilesWide && visitedMap[x + 1][y] === false && (invalidDirections === undefined ? true : !invalidDirections.includes((x + 1) + "," + y))];
		if (openDirections.includes(true)){
			//A direction is open, make a random move
			//Create an array of the different directions that can be moved in
			let validDirections = [];
			for (let i = 0; i < openDirections.length; i++){
				if (openDirections[i]){
					validDirections.push(i);
				}
			}
			switch (validDirections[getRandomInt(validDirections.length)]){
				case 0:
					y--;
					visitedMap[x][y] = true;
					tilesGenerated++;
					break;
				case 1:
					y++;
					visitedMap[x][y] = true;
					tilesGenerated++;
					break;
				case 2:
					x--;
					visitedMap[x][y] = true;
					tilesGenerated++;
					break;
				case 3:
					x++;
					visitedMap[x][y] = true;
					tilesGenerated++;
					break;
				default:
					break;
			}
			pathSequence.push([x, y]);
		}else{
			//No directions are open, back up
			let prevEnd = pathSequence.pop();
			visitedMap[prevEnd[0]][prevEnd[1]] = false;
			x = pathSequence[pathSequence.length - 1][0];
			y = pathSequence[pathSequence.length - 1][1];
			tilesGenerated--;

			let invalidMap = obstacleMapToString(visitedMap);
			if (invalidMoves[invalidMap] === undefined){
				invalidMoves[invalidMap] = [];
			}
			invalidMoves[invalidMap].push(prevEnd[0] + "," + prevEnd[1]);
		}

		timeElapsed += new Date() - startTime;

		if (timeElapsed > 10000){
			restart = confirm("The current level is taking a while to generate, would you like to start again?");
		}

		if (restart){
			generateTiles();
			return;
		}
	}
	obstacles = tilesWide * tilesTall - 1;
	//Adequate path generated, set the real tile map
	for (let xCoord = 0; xCoord < tiles.length; xCoord++){
		for (let yCoord = 0; yCoord < tiles[x].length; yCoord++){
			if (visitedMap[xCoord][yCoord] && tiles[xCoord][yCoord].dataset.tiletype === "obstacle"){
				tiles[xCoord][yCoord].dataset.tiletype = "empty";
				tiles[xCoord][yCoord].style.backgroundColor = defaultTileColor;
				obstacles--;
			}
		}
	}

	//Add grid styling to game board to size tiles in the grid
	tileDiv.style.gridTemplateColumns = boardColumns;
	tileDiv.style.gridTemplateRows = boardRows;
}

function obstacleMapToString(visitedMap){
	let str = "";
	for (let x = 0; x < visitedMap.length; x++){
		for (let y = 0; y < visitedMap[x].length; y++){
			str += (visitedMap[x][y] ? "1": "0");
		}
	}
	return str;
}


