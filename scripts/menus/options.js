function updateToggleSwitches(){
	let vibrationToggleSwitch = document.querySelector("input#vibration-toggle-switch");
	vibrationToggleSwitch.checked = vibration;
}

function vibrationSwitchToggle(){
	let vibrationToggleSwitch = document.querySelector("input#vibration-toggle-switch");
	setVibration(vibrationToggleSwitch.checked);
}