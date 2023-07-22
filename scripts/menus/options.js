function updateToggleSwitches(){
	let vibrationToggleSwitch = document.querySelector("input#vibration-toggle-switch");
	vibrationToggleSwitch.checked = vibration;
	let sfxToggleSwitch = document.querySelector("input#sfx-toggle-switch");
	sfxToggleSwitch.checked = sfxEnabled;
}

function vibrationSwitchToggle(){
	let vibrationToggleSwitch = document.querySelector("input#vibration-toggle-switch");
	setVibration(vibrationToggleSwitch.checked);
}

function sfxSwitchToggle(){
	let sfxToggleSwitch = document.querySelector("input#sfx-toggle-switch");
	setSFXEnabled(sfxToggleSwitch.checked);
}