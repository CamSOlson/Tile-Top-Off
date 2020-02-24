window.addEventListener("load", function(){
	document.querySelector("span#high-score-easy").innerHTML = parent.highScoreEasy;
	document.querySelector("span#high-score-norm").innerHTML = parent.highScoreNorm;
	document.querySelector("span#high-score-hard").innerHTML = parent.highScoreHard;
});