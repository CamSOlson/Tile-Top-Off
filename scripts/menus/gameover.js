function updateGameOverSpans(){
	let goDifficultySpan = document.querySelector("span#game-over-difficulty")
	switch (difficulty){
		default:
			goDifficultySpan.innerHTML = "Custom";
			break;
		case 0:
			goDifficultySpan.innerHTML = "Easy";
			break;
		case 1:
			goDifficultySpan.innerHTML = "Normal";
			break;
		case 2:
			goDifficultySpan.innerHTML = "Hard";
			break;
	}

	document.querySelector("span#game-over-score").innerHTML = score;
}