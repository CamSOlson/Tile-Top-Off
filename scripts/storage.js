var localStorage;
var useLocalStorage = false;

function initLocalStorage(){
	try{
		localStorage = window.localStorage;
		useLocalStorage = true;

		//High scores
		if (localStorage.highScoreCustom === undefined){
			localStorage.highScoreCustom = 0;
		}
		highScoreCustom = Number(localStorage.highScoreCustom);
		if (localStorage.highScoreEasy === undefined){
			localStorage.highScoreEasy = 0;
		}
		highScoreEasy = Number(localStorage.highScoreEasy);
		if (localStorage.highScoreNorm === undefined){
			localStorage.highScoreNorm = 0;
		}
		highScoreNorm = Number(localStorage.highScoreNorm);
		if (localStorage.highScoreHard === undefined){
			localStorage.highScoreHard = 0;
		}

		//Board size
		if (localStorage.customBoardSize === undefined){
			localStorage.customBoardSize = 5;
		}
		customBoardSize = Math.min(localStorage.customBoardSize, 10);

		//Path complexity
		if (localStorage.customPathComplexity === undefined){
			localStorage.customPathComplexity = 0.5;
		}
		customPathComplexity = Math.min(localStorage.customPathComplexity, 0.70);

		//Vibration
		if (localStorage.vibration === undefined){
			localStorage.vibration = true;
		}
		vibration = localStorage.vibration == "true";
	}catch(e){
		console.log(e);
	}
}

initLocalStorage();