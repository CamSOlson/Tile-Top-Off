var installButton;
var deferredInstallPrompt;

window.addEventListener("load", function(){
	installButton = document.querySelector("a#install-button");

	window.addEventListener("beforeinstallprompt", function(event){
		deferredInstallPrompt = event;
		installButton.removeAttribute("hidden");	
	});
	
	window.addEventListener("appinstalled", function(event){
		console.log("Tile Top Off was installed.", event);
	});
});

function install(){
	deferredInstallPrompt.prompt();
	// Hide the install button, it can't be called twice.
	event.srcElement.setAttribute("hidden", true);
	deferredInstallPrompt.userChoice.then((choice) => {
		if (choice.outcome === "accepted") {
			console.log("accepted A2HS prompt", choice);
		} else {
			console.log("dismissed A2HS prompt", choice);
		}
		deferredInstallPrompt = null;
	});
}

