var menu;

window.addEventListener("load", function(){
    menu = document.querySelector("section#menu");
});

function toggleMenu(){
    if (menu.classList.contains("open")){
        closeMenu();
    }else{
        showMenu();
    }
}

function closeMenu(){
    menu.classList.remove("open");
    if (history.state === "menu"){
        history.back();
    }
}

function showMenu(){
    menu.classList.add("open");
    if (history.state !== "menu"){
        history.pushState("menu", "menu", window.location.href);
    }
}