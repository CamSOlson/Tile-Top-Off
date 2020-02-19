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
	event.srcElement.setAttribute("hidden", true);
	deferredInstallPrompt.userChoice.then((choice) => {
		deferredInstallPrompt = null;
	});
}

