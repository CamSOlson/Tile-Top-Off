var hideOnInstallElems;
var deferredInstallPrompt;

window.addEventListener("load", function(){
	hideOnInstallElems = document.querySelectorAll("*.hide-on-install");

	window.addEventListener("beforeinstallprompt", function(event){
		deferredInstallPrompt = event;
		for (let elem of hideOnInstallElems){
			elem.removeAttribute("hidden");
		}
	});
	
	window.addEventListener("appinstalled", function(event){
		console.log("Tile Top Off was installed.", event);
	});
});

function install(){
	deferredInstallPrompt.prompt();
	deferredInstallPrompt.userChoice.then((choice) => {
		if (choice.outcome === "accepted"){
			for (let elem of hideOnInstallElems){
				elem.setAttribute("hidden", true);
			}
		}
		deferredInstallPrompt = null;
	});
}

