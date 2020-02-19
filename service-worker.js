const CACHE_NAME = "TTF_0.1";
const FILES_TO_CACHE = [
	"/", "/service-worker.js", "/public/manifest.json",
	"/index.html", "/menus/instructions.html", "/menus/options.html",
	"/styles/main.css", "/styles/popup.css", "/styles/scrollbar.css", "/styles/sliders.css",
	"/scripts/game.js", "/scripts/menu.js", "/scripts/popup.js", "/scripts/menus/options.js", "/scripts/install.js",
	"/media/images/example-board-fill-move.png", "/media/images/example-board-move.png", "/media/images/example-board-path.png",
		"/media/images/example-board.png", "/media/images/full-move-diagram.png", "/media/images/move-diagram.png",
		"/media/images/icons/icon-64x64.png", "/media/images/icons/icon-192x192.png", "/media/images/icons/icon-512x512.png"
];

self.addEventListener("install", function(event) {
	event.waitUntil(
		caches.open(CACHE_NAME).then((cache) => {
			console.log("[ServiceWorker] Pre-caching pages");
			return cache.addAll(FILES_TO_CACHE);
		})
	);
});

self.addEventListener("activate", function(event){
	event.waitUntil(
		caches.keys().then((keyList) => {
			return Promise.all(keyList.map((key) => {
				if (key !== CACHE_NAME) {
					console.log('[ServiceWorker] Removing old cache', key);
					return caches.delete(key);
				}
			}));
		})
	);
});

self.addEventListener("fetch", function(event) {
	if (event.request.mode !== 'navigate') {
		// Not a page navigation, bail.
		return;
	}

	event.respondWith(
		fetch(event.request)
			.catch(() => {
			  return caches.open(CACHE_NAME)
				  .then((cache) => {
					return cache.match('/index.html');
				  });
			})
	);
});
