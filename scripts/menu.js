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
}

function showMenu(){
    menu.classList.add("open");
}