var closeNextPopupState = false;

window.addEventListener("popstate", historyPopStateListener);

function historyPopStateListener(e){
	closeNextPopupState = false;

	switch (history.state){
		default:
			closePopup();
			closeMenu();
			if (gameOver){
				showStartScreen();
			}
			break;
		case "popup":
			closeMenu();
			if (closeNextPopupState){
				closePopup();
			}else{
				disableGameInput();
				if (lastPopup === undefined){
					setPopup(instructionPopup);
				}else{
					setPopup(lastPopup);
				}
				showPopup(lastPopup, lastPopupName);	
			}
			break;
		case "menu":
			showMenu();
			break;
	}
}