                                    /* Service Worker*/

// Name of the cache
const CACHE_NAME = 'boosterlander-game-cache';

// App assets to be stored in the cache
var cacheAssets = [
    '/boosterlander/index.html',
    '/boosterlander/styles/styles.css',
    '/boosterlander/game/languages/languages.json',
    '/boosterlander/game/bin/javascript/boosterlander.js',
    '/boosterlander/game/sounds/blip-start.mp3',
    '/boosterlander/game/sounds/blip.mp3',
    '/boosterlander/game/sounds/switch.mp3',
    '/boosterlander/game/sounds/swoosh.mp3',
    '/boosterlander/game/sounds/sonic-boom.mp3',
    '/boosterlander/game/sounds/rumble.mp3',
    '/boosterlander/game/sounds/water.mp3',
    '/boosterlander/game/sounds/explosion.mp3'
];

// Install service worker and store assets in the cache
self.addEventListener('install', function(event){
    console.log('Server worker: installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('cache opened');
            return cache.addAll(cacheAssets);
        })
    );
});

// Ask the user to allow notifications
self.addEventListener('appinstalled', function(){
    if(Notification.permission !== 'granted'){
        Notification.requestPermission();
    }
});

// Handle fetch and HTTP requests
self.addEventListener('fetch', fetchEvent => {
    fetchEvent.respondWith(
        fetch(fetchEvent.request)
        .then(fetchResponse => {

            var fetchResponseClone = fetchResponse.clone();

            caches.open(CACHE_NAME)
            .then(cacheObj => {

               if(fetchResponseClone.status === 200){
                    cacheObj.put(fetchEvent.request, fetchResponseClone);
               }

            });
            return fetchResponse;
        }).catch(fetchError => caches.match(fetchEvent.request).then(res => res))
    );
})

// Handle notifications
self.addEventListener('notificationclick', function(clickEvent){
    clickEvent.action === 'close' ? clickEvent.notification.close() : undefined;
});

/*
self.addEventListener('notificationclose', function(clickEvent){
    clients.openWindow('http://astudillojuanf.github.local');
});
*/
