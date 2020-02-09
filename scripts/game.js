var tileSize = "100%";

var tilesWide = 5;
var tilesTall = 5;
var obstacles = 0;
var tilesFilled = 0;
var pathComplexity = 0.5;

var tiles = [[]];
var playerTile;
var startPos;
var path;

var defaultTileColor = "rgba(0, 0, 0, 0)";
var obstacleTileColor = "#888888";
var playerColors = ["#ff2626", "#ff9326", "#ffff00", "#00ff40", "#0080ff", "#9326ff", "#ff73ff"];
var playerTileColor = playerColors[0];

var statusDiv;
var statusMain;
var statusSub;
var tileDiv;

var score = 0;

var gameOver = false;
var transition = false;
var starting = true;

var mainGame;
var gameBoard;

var localStorage;
var useLocalStorage = false;

var blockInput = false;

window.addEventListener("load", function(){
	loadGame();
	
	window.onkeydown = function(e){
		e = e || window.event;
		update(e.keyCode);
	}
	
	gameBoard.addEventListener("click", function(e){
		let rect = gameBoard.getBoundingClientRect();
		let scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
		let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
		
		touchMove(gameBoard, e.clientX - rect.left - scrollLeft, e.clientY - rect.top - scrollTop);
	});

	swipeMovement(gameBoard, function(swipeDir){
        if (swipeDir != "none"){
            switch (swipeDir){
				case "up":
					update(38, true);
					break;
				case "down":
					update(40, true);
					break;
				case "left":
					update(37, true);
					break;
				case "right":
					update(39, true);
					break;
			}
        }
    });
});

function loadGame(){
	statusDiv = document.querySelector("div#status");
	statusMain = document.querySelector("a#statusMain");
	statusSub = document.querySelector("a#statusSub");
	tileDiv = document.querySelector("div#tiles");
		
	initLocalStorage();
	initHighScore();
	initBoardSize();
	initPathComplexity();

	mainGame = document.querySelector("main#game");
	gameBoard = document.querySelector("section#board");
	
	showStart();
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
	hideStatus();
}

function initLocalStorage(){
	try{
		localStorage = window.localStorage;
		useLocalStorage = true;
	}catch(e){

	}
}

function initHighScore(){
	if (useLocalStorage){
		//Setup high score
		if (localStorage.highscore === undefined){
			localStorage.highscore = 0;
		}
		statusSub.innerHTML = statusSub.innerHTML.replace("@hs", localStorage.highscore);
	}else{
		//No high score storage
		statusSub.innerHTML = statusSub.innerHTML.replace("@hs", "Offline -- No high score available");
	}
}

function initBoardSize(){
	if (useLocalStorage){
		if (localStorage.boardSize === undefined){
			localStorage.boardSize = 5;
		}
		tilesWide = Math.min(localStorage.boardSize, 12);
		tilesTall = Math.min(localStorage.boardSize, 12);
	}
}

function setBoardSize(size){
	if (useLocalStorage){
		localStorage.boardSize = size;
	}
	tilesWide = size;
	tilesTall = size;
}

function initPathComplexity(){
	if (useLocalStorage){
		if (localStorage.pathComplexity === undefined){
			localStorage.pathComplexity = 0.5;
		}
		pathComplexity = Math.min(localStorage.pathComplexity, 0.70);
	}
}

function setPathComplexity(amount){
	if (useLocalStorage){
		localStorage.pathComplexity = amount;
	}
	pathComplexity = amount;
}

function getAdjacentTiles(x, y){
	let adjTiles = [];
	//Above
	if (y > 0){
		adjTiles.push(tiles[x][y - 1]);
	}else{
		adjTiles.push(undefined);
	}
	//Below
	if (y < tilesTall - 1){
		//adjTiles += tiles[x][y + 1];
		adjTiles.push(tiles[x][y + 1]);
	}else{
		adjTiles.push(undefined);
	}
	//Left
	if (x > 0){
		//adjTiles += tiles[x - 1][y];
		adjTiles.push(tiles[x - 1][y]);
	}else{
		adjTiles.push(undefined);
	}
	//Right
	if (x < tilesWide - 1){
		//adjTiles += tiles[x + 1][y];
		adjTiles.push(tiles[x + 1][y]);
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
		shift = window.event.shiftKey;
	}
	if (!blockInput){
		if (gameOver && !transition){
			if (key == "38" || key == "40" || key == "37" || key == "39" || key == "87" || key == "83" || key == "65" || key == "68") {

				showStart();
				gameOver = false;
				loadGame();
			}
		}else if (starting){
			if (key == "38" || key == "40" || key == "37" || key == "39" || key == "87" || key == "83" || key == "65" || key == "68") {
				starting = false;
				hideStatus();
			}
		}else if (!transition && !starting){
			//Check movements
			if (key == "38" || key == "87") {
				move(0, shift);
			}
			else if (key == "40" || key == "83") {
				move(1, shift);
			}
			else if (key == "37" || key == "65") {
			   move(2, shift);
			}
			else if (key == "39" || key == "68") {
			   move(3, shift);
			}
			
			//Check if the player is at a dead end
			if (atDeadEnd()){
				if (checkWinState()){
					transition = true;
					score++;
					showStatus("STAGE COMPLETE", "#00FF00", "Score: " + score + "<br><br>Generating next level...", "#C8FFC8", "Black");
					//Update high score in storage
					if (useLocalStorage && score > Number(localStorage.highscore)){
						localStorage.highscore = score;
					}
					//Set delayed reset
					setTimeout(function() {generateTiles();}, 500);
					setTimeout(hideStatus, 1500);
					setTimeout(function() {transition = false}, 1500);
				}else{
					gameOver = true;
					showStatus("GAME OVER", "#FF0000", "Stages complete: " + score + "<br><br>Move to continue...", "#FFC8C8", "rgba(0.5, 0.5, 0.5, 0.5)");
					score = 0;
				}
			}
		}
	}
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

function showStart(){
	starting = true;
	showStatus("Tile Top Off", "White", "<a href='https://camsolson.com' target='-blank'>Cam Olson</a><br>v. 1.0<br><br><br>You are the <span style='color:#fb0000' id='player-instructions'><span style='font-size:2rem;font-style:normal;'>■</span> Colored Tile</span><br><br>Fill in the <span style='color:#333333'><span style='font-size:2rem;font-style:normal;'>■</span> Empty Tiles</span><br><br>Go around the randomly generated <span style='color:#888888'><span style='font-size:2rem;font-style:normal;'>■</span> Walls</span><br><br><br>Use <span style='color:#C0C0C0'>[W] [A] [S]</span> and <span style='color:#C0C0C0'>[D]</span>, the <span style='color:#C0C0C0'>Arrow Keys</span>, or <span style='color:#C0C0C0'>Swipe</span> in the direction you want to move<br><br>No <span style='color:#C0C0C0'>backtracking</span><br><br>The board gets bigger the longer you play<br><br><br><span style='font-size:1.5rem;'>High score: @hs</span><br><br><br><span style='color:#C0C0C0'>Move to start...</span>", "White", "rgba(0, 0, 0, 1)");
	initHighScore();
}

function move(direction, allTheWay){
	do {
		let adjacentTiles = getAdjacentTiles(playerTile.style.gridColumnStart - 1, playerTile.style.gridRowStart - 1);
		if (adjacentTiles[direction] !== undefined){
			allTheWay = movePlayer(playerTile, adjacentTiles[direction]) && allTheWay;
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
		targetTile.style.backgroundColor = getUsedTileColor();
		return true;
	}else{
		return false;
	}
}

function getUsedTileColor(){
	let max = tilesWide * tilesTall - obstacles;
	let percentage = tilesFilled / max;
	percentage = percentage / 2 + 0.5;
	let rgb = hexToRGB(playerTileColor);
	return "rgba(" + Math.min(255, (percentage * rgb.r) * 0.5) + ", " + Math.min(255, (percentage * rgb.g) * 0.5) + ", " + Math.min(255, (percentage * rgb.b) * 0.5) + ", 255)";
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
	let t1x = tile1.style.gridColumnStart;
	let t1y = tile1.style.gridRowStart;
	tile1.style.gridColumnStart = tile2.style.gridColumnStart;
	tile1.style.gridRowStart = tile2.style.gridRowStart;
	tile2.style.gridColumnStart = t1x;
	tile2.style.gridRowStart = t1y;
	
	tiles[tile1.style.gridColumnStart - 1][tile1.style.gridRowStart - 1] = tile1;
	tiles[tile2.style.gridColumnStart - 1][tile2.style.gridRowStart - 1] = tile2;
}

function atDeadEnd(){
	for (let tile of getAdjacentTiles(playerTile.style.gridColumnStart - 1, playerTile.style.gridRowStart - 1)){
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
    elapsedTime, startTime,
    swipeEvent = callback || function(swipeDir){};
  
    touchElem.addEventListener("touchstart", function(e){
        let touchobj = e.changedTouches[0];
        swipeDir = "none";
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
    });
  
    touchElem.addEventListener("touchmove", function(e){e.preventDefault();});
  
    touchElem.addEventListener("touchend", function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipeDir = (distX < 0)? "left" : "right";
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                swipeDir = (distY < 0)? "up" : "down";
            }
        }
        swipeEvent(swipeDir);
    }, false)
}

//Tile generator

function generateTiles() {
	tilesTall = tilesWide;
	tilesFilled = 0;
	tileSize = (100 / tilesWide) + "%";
	
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
	//Populate game board with tiles. Iterate through tile width and height
	for (let x = 0; x < tilesWide; x++){
		boardColumns += " " + tileSize;
		let column = []
		for (let y = 0; y < tilesTall; y++){
			let tile = document.createElement("a");
			tile.classList.add("tile");
			tile.style.gridColumnStart = x + 1;
			tile.style.gridRowStart = y + 1;
			tileDiv.appendChild(tile);			
			column[y] = tile;
		}
		tiles[x] = column;
	}
	
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
	let x = getRandomInt(tilesWide);
	let y = getRandomInt(tilesTall);
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
	for (let xCoord = 0; xCoord < tilesWide; xCoord++){
		for (let yCoord = 0; yCoord < tilesTall; yCoord++){
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


