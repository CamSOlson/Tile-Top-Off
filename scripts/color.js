var defaultTileColor = "#333333";
var obstacleTileColor = "#888888";
var playerColors = ["#ff2626", "#ff9326", "#ffff00", "#00ff40", "#0080ff", "#9326ff", "#ff73ff"];
var playerTileColor = playerColors[0];

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