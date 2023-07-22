var undoDirection = -1;
var undos;

function move(direction, allTheWay){
	let moveID = pastMoves.length;
	let moved = false;
	do {
		let adjacentTiles = getAdjacentTiles(playerTile.dataset.x, playerTile.dataset.y);
		if (adjacentTiles[direction] !== undefined){
			let fullMove = allTheWay;
			let playerMoved = movePlayer(playerTile, adjacentTiles[direction]);
			allTheWay = playerMoved && allTheWay;
			if (playerMoved){
				pastMoves.push([adjacentTiles[direction].dataset.x + ", " + adjacentTiles[direction].dataset.y, moveID, fullMove]);
				moved = true;
			}
		}else{
			allTheWay = false;
		}
	} while (allTheWay);
	
	if (moved){
		playSound(moveTileSound);
	}else{
		playSound(blockedTileSound);
	}
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

var pastMoves = [[]];

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
	let undoPerformed = false;
	do {
		if (pastMoves[pastMoves.length - 1] !== undefined && (undoID === -1 || undoID === pastMoves[pastMoves.length - 1][1])){
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
			undoPerformed = true;
		}else{
			undoFullMove = false;
		}
	} while (undoFullMove);

	if (undoPerformed){
		undos--;
	}

	updateGameActionButtons();
}