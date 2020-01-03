var tileSize = "100%";

var tilesWide = 0;
var tilesTall = 0;
var obstacles = 0;
var tilesFilled = 0;

var tiles = [[]];
var playerTile;
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

var swipeObject;

var localStorage;
var useLocalStorage = false;

window.onload = function(){
	load();
	
	swipedetect(swipeObject, function(swipedir){
        if (swipedir != "none"){
            switch (swipedir){
				case "up":
					update(38);
					break;
				case "down":
					update(40);
					break;
				case "left":
					update(37);
					break;
				case "right":
					update(39);
					break;
			}
        }
    })
}

function load(){
	statusDiv = document.querySelector("div#status");
	statusMain = document.querySelector("a#statusMain");
	statusSub = document.querySelector("a#statusSub");
	tileDiv = document.querySelector("div#tiles");
		
	initHighScore();

	swipeObject = document.querySelector("main#game");
	

	showStart();
	generateTiles(score);
}

function initHighScore(){
		try{
		localStorage = window.localStorage;
		//Setup high score
		if (localStorage.highscore === undefined){
			localStorage.highscore = 0;
		}
		statusSub.innerHTML = statusSub.innerHTML.replace("@hs", localStorage.highscore);
		useLocalStorage = true;
	}catch(e){
		//No high score storage
		statusSub.innerHTML = statusSub.innerHTML.replace("@hs", "Offline -- No high score available");
	}
}

function generateTiles(score){	
	tilesWide = getBoardSize(score);
	tilesTall = tilesWide;
	obstacles = getObstacleCount(tilesWide);
	tilesFilled = 0;
	tileSize = (100 / tilesWide) + "%";
	
	let prevColor = playerTileColor;
	while (playerTileColor == prevColor){
		playerTileColor = playerColors[getRandomInt(playerColors.length)];
	}
	let playerInstruction = document.querySelector("span#player_instructions");
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
	
	//Make sure to validate with an offshot of a hamiltonian curve to ensure each level is possible. Generate obstacles and start until it fits.
	setSpecialTiles();
	while (!testLayout()){
		setSpecialTiles();
	}
	
	//Add grid styling to game board to size tiles in the grid
	tileDiv.style.gridTemplateColumns = boardColumns;
	tileDiv.style.gridTemplateRows = boardRows;
}

function getBoardSize(score){
	return Math.min(6, Math.trunc((Math.pow(score, 1 / 2) / 3) + 3));
	//return 4;
}
function getObstacleCount(boardSize){
	//anywhere from 10% to 35% of board filled
	let percentage = 10 + getRandomInt(35);
	return Math.trunc(boardSize * boardSize * (0.01 * percentage));
}

function setSpecialTiles(){
		//Reset all tiles to "empty"
		for (let x = 0; x < tiles.length; x++){
			for (let y = 0; y < tiles[x].length; y++){
				tiles[x][y].dataset.tiletype = "empty";
				tiles[x][y].style.backgroundColor = defaultTileColor;
			}
		}
		
		//Generate obstacles
		let obstaclePositions = [];
		for (let i = 0; i < obstacles; i++){
			//Generate random coordinates
			let x = getRandomInt(tilesWide);
			let y = getRandomInt(tilesTall);
			let pair = x + ", " + y;
			while (obstaclePositions.includes(pair)){
				x = getRandomInt(tilesWide);
				y = getRandomInt(tilesTall);
				pair = x + ", " + y;
			}
			
			let tile = tiles[x][y];
			tile.dataset.tiletype = "obstacle";
			tile.style.backgroundColor = obstacleTileColor;
			
			//Keep track of the position so another obstacle isn"t created there
			obstaclePositions[i] = pair;
		}
		//Generate start
		let x = getRandomInt(tilesWide);
		let y = getRandomInt(tilesTall);
		let pair = x + ", " + y;
		while (obstaclePositions.includes(pair)){
			x = getRandomInt(tilesWide);
			y = getRandomInt(tilesTall);
			pair = x + ", " + y;
		}
			
		let tile = tiles[x][y];
		tile.dataset.tiletype = "start";
		tile.style.backgroundColor = playerTileColor;
		playerTile = tile;
}

function testLayout(){
	//Get starting tile
	let path = [playerTile];
	
	let tileCount = tilesWide * tilesTall - obstacles - 1;
	let result = tryPath(path, tileCount, 0);
	if (result) {	
		this.path = path;
	}
	return result;
}

function tryPath(path, tileCount, tilesPassed){
	//Check if all tiles are included
	if (path.length === tilesWide * tilesTall - obstacles){
		return true;
	}
	//Continuously check adjacent tiles and recurse down different paths
	for (let adjTile of getAdjacentTiles(path[path.length - 1].style.gridColumnStart - 1, path[path.length - 1].style.gridRowStart - 1)){
		//Check if the tile has been used before or is an obstacle
		if (adjTile.dataset.tiletype === "empty" && !path.includes(adjTile)){
			//Add adjacent tile to the path for testing
			path[path.length] = adjTile;
			
			//Recurse. If that method returns true, return true since the end has been found
			if (tryPath(path, tileCount, tilesPassed + 1)){
				return true;
			}
			
			//If there was no return, pop the item since it didn"t work
			path.pop();
		}
	}
	return false;
}

function getAdjacentTiles(x, y){
	let adjTiles = [];
	//Above
	if (y > 0){
		adjTiles.push(tiles[x][y - 1]);
	}
	//Below
	if (y < tilesTall - 1){
		//adjTiles += tiles[x][y + 1];
		adjTiles.push(tiles[x][y + 1]);
	}
	//Left
	if (x > 0){
		//adjTiles += tiles[x - 1][y];
		adjTiles.push(tiles[x - 1][y]);
	}
	//Right
	if (x < tilesWide - 1){
		//adjTiles += tiles[x + 1][y];
		adjTiles.push(tiles[x + 1][y]);
	}
	return adjTiles;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

window.onkeydown = function(e){
	e = e || window.event;
	update(e.keyCode);
}

function update(key){
	if (gameOver && !transition){
		if (key == "38" || key == "40" || key == "37" || key == "39" || key == "87" || key == "83" || key == "65" || key == "68") {
			showStart();
			gameOver = false;
			load();
		}
	}else if (starting){
		if (key == "38" || key == "40" || key == "37" || key == "39" || key == "87" || key == "83" || key == "65" || key == "68") {
			starting = false;
			hideStatus();
		}
	}else if (!transition && !starting){
		//Check movements
		if (key == "38" || key == "87") {
			move(0);
		}
		else if (key == "40" || key == "83") {
			move(1);
		}
		else if (key == "37" || key == "65") {
		   move(2);
		}
		else if (key == "39" || key == "68") {
		   move(3);
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
				setTimeout(function() {generateTiles(score);}, 500);
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

function showStart(){
	starting = true;
	showStatus("Tile Top Off", "White", "<a href='https://camsolson.com' target='_blank'>Cam Olson</a><br>v. 1.0<br><br><br>You are the <span style='color:#fb0000' id='player_instructions'><span style='font-size:2rem;font-style:normal;'>■</span> Colored Tile</span><br><br>Fill in the <span style='color:#333333'><span style='font-size:2rem;font-style:normal;'>■</span> Empty Tiles</span><br><br>Go around the randomly generated <span style='color:#888888'><span style='font-size:2rem;font-style:normal;'>■</span> Walls</span><br><br><br>Use <span style='color:#C0C0C0'>[W] [A] [S]</span> and <span style='color:#C0C0C0'>[D]</span>, the <span style='color:#C0C0C0'>Arrow Keys</span>, or <span style='color:#C0C0C0'>Swipe</span> in the direction you want to move<br><br>No <span style='color:#C0C0C0'>backtracking</span><br><br>The board gets bigger the longer you play<br><br><br><span style='font-size:1.5rem;'>High score: @hs</span><br><br><br><span style='color:#C0C0C0'>Move to start...</span>", "White", "rgba(0, 0, 0, 1)");
	initHighScore();
}

function move(direction){
	let adjacentTiles = getAdjacentTiles(playerTile.style.gridColumnStart - 1, playerTile.style.gridRowStart - 1);
	
	switch (direction){
		case 0:
		//UP
			for (let tile of adjacentTiles){
				if (tile.style.gridRowStart - 1 === playerTile.style.gridRowStart - 2){
					movePlayer(playerTile, tile);
				}
			}
			break;
		case 1:
		//DOWN
			for (let tile of adjacentTiles){
				if (tile.style.gridRowStart - 2 === playerTile.style.gridRowStart - 1){
					movePlayer(playerTile, tile);
				}
			}
			break;
		case 2:
		//LEFT
			for (let tile of adjacentTiles){
				if (tile.style.gridColumnStart - 1 === playerTile.style.gridColumnStart - 2){
					movePlayer(playerTile, tile);
				}
			}
			break;
		case 3:
		//RIGHT
			for (let tile of adjacentTiles){
				if (tile.style.gridColumnStart - 2 === playerTile.style.gridColumnStart - 1){
					movePlayer(playerTile, tile);
				}
			}
			break;
			
	}
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
		if (tile.dataset.tiletype === "empty"){
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
	statusDiv.classList.remove("status_hidden");
	statusDiv.classList.add("status_shown");
	statusMain.classList.remove("status_hidden");
	statusMain.classList.add("status_shown");
	statusSub.classList.remove("status_hidden");
	statusSub.classList.add("status_shown");
}
function hideStatus(){
	statusDiv.classList.remove("status_shown");
	statusDiv.classList.add("status_hidden");
	statusMain.classList.remove("status_shown");
	statusMain.classList.add("status_hidden");
	statusSub.classList.remove("status_shown");
	statusSub.classList.add("status_hidden");
}

function swipedetect(e, callback){
  
    var touchsurface = e, swipedir, startX, startY, distX, distY, 
	threshold = 100, //min dist
    restraint = 100, //max deviation
    allowedTime = 300, //max time
    elapsedTime,
    startTime,
    handleswipe = callback || function(swipedir){}
  
    touchsurface.addEventListener("touchstart", function(e){
        let touchobj = e.changedTouches[0];
        swipedir = "none";
        dist = 0;
        startX = touchobj.pageX;
        startY = touchobj.pageY;
        startTime = new Date().getTime();
        e.preventDefault();
    });
  
    touchsurface.addEventListener("touchmove", function(e){e.preventDefault();});
  
    touchsurface.addEventListener("touchend", function(e){
        var touchobj = e.changedTouches[0]
        distX = touchobj.pageX - startX;
        distY = touchobj.pageY - startY;
        elapsedTime = new Date().getTime() - startTime;
        if (elapsedTime <= allowedTime){
            if (Math.abs(distX) >= threshold && Math.abs(distY) <= restraint){
                swipedir = (distX < 0)? "left" : "right";
            }
            else if (Math.abs(distY) >= threshold && Math.abs(distX) <= restraint){
                swipedir = (distY < 0)? "up" : "down";
            }
        }
        handleswipe(swipedir)
        e.preventDefault()
    }, false)
}


