window.addEventListener("popstate", function(e){
	switch (history.state){
		default:
			closePopup();
			closeMenu();
			break;
		case "popup":
			closeMenu();
			disableGameInput();
			if (lastPopup === undefined){
				setPopup(instructionPopup);
			}else{
				setPopup(lastPopup);
			}
			showPopup(lastPopup, lastPopupName);
			break;
		case "menu":
			closePopup();
			showMenu();
			break;
	}
});