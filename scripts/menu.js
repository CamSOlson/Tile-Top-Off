var menu;

window.addEventListener("load", function(){
    menu = document.querySelector("section#menu");
});

function toggleMenu(){
    menu.classList.toggle("open");
}

function closeMenu(){
    menu.classList.remove("open");
}

function showMenu(){
    menu.classList.add("open");
}