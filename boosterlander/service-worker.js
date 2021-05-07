if('serviceWorker' in navigator){
    console.log('Service workers supported')
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then( success => console.log('Service worker: registered'));
    });
}else{
    console.warn('ServiceWorker API is unsupported by the browser');
}

// Name of the cache
const CACHE_NAME = 'boosterlander-game-cache';

// App assets to be stored on the cache
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

self.addEventListener('install', function(event){
    console.log('Server worker: installed')
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('cache opened');
            return cache.addAll(cacheAssets);
        })
    );
});

self.addEventListener('appinstalled', function(){
    Notification.requestPermission();
});

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

self.addEventListener('notificationclick', function(clickEvent){
    clickEvent.action === 'close' ? clickEvent.notification.close() : undefined;
});

/*
self.addEventListener('notificationclose', function(clickEvent){
    clients.openWindow('http://astudillojuanf.github.local');
});
*/
