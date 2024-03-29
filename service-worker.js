const CACHE_NAME = "TTF_0.1";
const FILES_TO_CACHE = [
	"/", "/service-worker.js", "/public/manifest.json", "/index.html", 
	"/styles/main.css", "/styles/popup.css", "/styles/scrollbar.css", "/styles/start.css", "/styles/sliders.css", "/styles/toggle-switches.css",
		"/styles/menu.css",
	"/scripts/storage.js", "/scripts/game.js", "/scripts/menu.js", "/scripts/popup.js", "/scripts/menus/options.js", "/scripts/install.js",
		"/scripts/menus/start.js", "/scripts/audio.js", "/scripts/history.js", "/scripts/menus/gameover.js",
	"/media/images/example-board-fill-move.png", "/media/images/example-board-move.png", "/media/images/example-board-path.png",
		"/media/images/example-board.png", "/media/images/full-move-diagram.png", "/media/images/move-diagram.png", "/media/images/hold.png",
		"/media/images/icons/icon-64x64.png", "/media/images/icons/icon-192x192.png", "/media/images/icons/icon-512x512.png",
	"/media/fonts/Spartan/Spartan-VariableFont_wght.ttf", "/media/fonts/Spartan/OFL.txt",
	"/media/audio/sfx/move/default-normal-move.wav", "/media/audio/sfx/move/default-blocked.wav"
];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("activate", function(event){
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener("fetch", function(event) {
	if (event.request.mode !== "navigate") {
		// Not a page navigation, bail.
		return;
	}

	event.respondWith(
		fetch(event.request).catch(async () => {
			const cache = await caches.open(CACHE_NAME);
			return cache.match("/index.html");
		})
	);
});
