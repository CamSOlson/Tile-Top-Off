var closeNextPopupState = false;

window.addEventListener("popstate", historyPopStateListener);

function historyPopStateListener(e){
	switch (history.state){
		default:
			closePopup();
			closeMenu();
			if (gameOver){
				showStartScreen();
			}
			closeNextPopupState = false;
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
			closeNextPopupState = false;

			break;
		case "menu":
			showMenu();
			break;
	}
}