var sfxEnabled;
var musicEnabled;

var moveTileSound;
var blockedTileSound;

window.addEventListener("load", function(e){	
	moveTileSound = document.querySelector("audio#moveTileSound");
	blockedTileSound = document.querySelector("audio#blockedTileSound");
});

function setSFXEnabled(val){
	sfxEnabled = val;
	if (useLocalStorage){
		localStorage.sfx = val;
	}
}

function playSound(sound){
	if (sfxEnabled){
		sound.currentTime = 0;
		sound.play();	
	}
}