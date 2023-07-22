var tiles = [[]];
var playerTile;
var startPos;
var path;

var statusDiv;
var statusMain;
var statusSub;
var tileDiv;

var difficulty;
var score = 0;
var highScoreEasy = 0;
var highScoreNorm = 0;
var highScoreHard = 0;
var highScoreCustom = 0;

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
var undoCountSpan;
var undoButton;
var resetRefreshLabel;
var resetRefreshCount;
var resetButton;

var resetAvailable = true;
var resetRefresh = 0;
var resetRefreshWait = 5;

var inputLocked = false;

window.addEventListener("load", function(){
	mainGame = document.querySelector("main#game");
	gameBoard = document.querySelector("section#board");
	statusDiv = document.querySelector("div#status");
	statusMain = document.querySelector("p#statusMain");
	statusSub = document.querySelector("p#statusSub");
	tileDiv = document.querySelector("div#tiles");
	holdIndicator = document.querySelector("div#hold-indicator");
	startScreen = document.querySelector("section#start-screen");
	difficultySpan = document.querySelector("div#game-labels span#difficulty");
	scoreSpan = document.querySelector("div#game-labels span#score");
	undoCountSpan = document.querySelector("span#undo-count");
	resetRefreshLabel = document.querySelector("label#reset-refresh");
	resetRefreshCount = document.querySelector("span#reset-refresh-count");
	undoButton = document.querySelector("button#undo-button");
	resetButton = document.querySelector("button#reset-button");

	initLocalStorage();

	window.addEventListener("keydown", function(e){
		if (!inputLocked){
			e = e || window.event;
			update(e.keyCode);	
		}
	});
	window.addEventListener("keyup", function(e){
		inputLocked = false;
	});
	
	gameBoard.addEventListener("click", function(e){
		let rect = gameBoard.getBoundingClientRect();
		let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		
		touchMove(gameBoard, e.clientX - rect.left - scrollLeft, e.clientY - rect.top - scrollTop);
	});

	swipeMovement(gameBoard, function(swipeDir, held){
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

	undoButton.addEventListener("click", function(e){
		let key = "0";
		switch (undoDirection){
			case 0:
				update(38, false);
				break;
			case 1:
				update(39, false);
				break;
			case 2:
				update(40, false);
				break;
			case 3:
				update(37, false);
				break;

		}
	});

	resetButton.addEventListener("click", function(e){
		if (resetAvailable){
			resetAvailable = false;
			resetRefresh = resetRefreshWait;
			resetRefreshWait++;
			resetGame();
			resetRefreshCount.innerHTML = resetRefresh;
			resetRefreshLabel.classList.remove("hidden");
			updateGameActionButtons();
		}
	});
	
	showStartScreen();
});

function showStartScreen(){
	starting = true;
	startScreen.classList.remove("hidden");

	closeNextPopupState = true;
	closeMenu();
	closePopup();
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
	resetAvailable = true;
	resetRefresh = 0;
	resetRefreshWait = 5;
	resetRefreshCount.innerHTML = resetRefresh;
	resetRefreshLabel.classList.add("hidden");
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
	updateGameActionButtons();
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
				tiles[x][y].style.backgroundImage = "none";
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
	pastMoves = [];
	resetUndo();
	hideStatus();
}

function resetUndo(){
	undoDirection = -1;
	undos = Math.round(tilesWide / 2);
	undoCountSpan.innerHTML = undos;
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
		case -1:
			//Custom
			if (useLocalStorage && score > Number(localStorage.highScoreCustom)){
				localStorage.highScoreCustom = currentScore;
				highScoreCustom = currentScore;
			}
			break;
		case 0:
			//Easy
			if (useLocalStorage && score > Number(localStorage.highScoreEasy)){
				localStorage.highScoreEasy = currentScore;
				highScoreEasy = currentScore;
			}
			break;
		case 1:
			//Normal
			if (useLocalStorage && score > Number(localStorage.highScoreNorm)){
				localStorage.highScoreNorm = currentScore;
				highScoreNorm = currentScore;
			}
			break;
		case 2:
			//Hard
			if (useLocalStorage && score > Number(localStorage.highScoreHard)){
				localStorage.highScoreHard = currentScore;
				highScoreHard = currentScore;
			}
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

function update(key, shift){
	if (!shift){
		if (window.event !== undefined){
			shift = window.event.shiftKey;
		}
	}
	if (!blockInput){
		resetRefreshCount.innerHTML = resetRefresh;
		if (resetRefresh <= 0){
			resetRefreshLabel.classList.add("hidden");
		}else if (resetRefreshLabel.classList.contains("hidden")){
			resetRefreshLabel.classList.remove("hidden");
		}
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
					updateResetRefresh();
					transition = false;
					if ("vibrate" in window.navigator && vibration){
						window.navigator.vibrate(250);
					}
					inputLocked = true;
				}else{
					gameOver = true;
					//showStatus("GAME OVER", "#FF0000", "Stages complete: " + score + "<br><br>Move to continue...", "#FFC8C8", "rgba(0.5, 0.5, 0.5, 0.5)");
					updateScore(score, difficulty);
					showGameOverPopup();
					score = 0;
					if ("vibrate" in window.navigator && vibration){
						window.navigator.vibrate(500);
					}
					//inputLocked = true;
				}
			}
		}
	}
	undoCountSpan.innerHTML = undos;
}

function updateGameActionButtons(){
	if (undos <= 0){
		undoButton.classList.add("disabled");
	}else if (undoButton.classList.contains("disabled")){
		undoButton.classList.remove("disabled");
	}

	if (!resetAvailable){
		resetButton.classList.add("disabled");
	}else if (resetButton.classList.contains("disabled")){
		resetButton.classList.remove("disabled");
	}
}

function updateResetRefresh(){
	resetRefresh--;
	resetRefreshCount.innerHTML = resetRefresh;
	if (resetRefresh <= 0){
		resetAvailable = true;
		resetRefresh = 0;
		resetRefreshLabel.classList.add("hidden");
	}else if (resetRefreshLabel.classList.contains("hidden")){
		resetRefreshLabel.classList.remove("hidden");
	}
	updateGameActionButtons();
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