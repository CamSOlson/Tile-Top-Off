var tileSize = "100%";

var tilesWide = 5;
var customBoardSize = 5;
var tilesTall = 5;
var obstacles = 0;
var tilesFilled = 0;
var pathComplexity = 0.5;
var customPathComplexity = 0.5;

function generateTiles() {
	tilesTall = tilesWide;
	tilesFilled = 0;
	tileSize = (100 / tilesWide);
	resetUndo();
	updateGameActionButtons();
	
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
	let reset = false;
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
			reset = confirm("The current level is taking a while to generate, would you like to start again?");
		}

		if (reset){
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