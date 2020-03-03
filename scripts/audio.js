var sfxEnabled;
var muteMusic;

var moveTileSound;

window.addEventListener("load", function(e){
	moveTileSound = loadSound("../media/audio/sfx/move/default-normal-move.wav");
});

function setSFXEnabled(val){
	sfxEnabled = val;
	if (useLocalStorage){
		localStorage.sfx = val;
	}
}

function loadSound(src){
	let sound = document.createElement("audio");
	sound.src = src;
	sound.setAttribute("preload", "auto");
	sound.setAttribute("controls", "none");
	sound.style.display = "none";
	document.body.appendChild(sound);
	return sound;
}

function playSound(sound){
	if (sfxEnabled){
		sound.currentTime = 0;
		sound.play();	
	}
}