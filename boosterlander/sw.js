if('serviceWorker' in navigator){
    window.addEventListener('load', function(){
        navigator.serviceWorker.register('sw.js')
        .then((success)=> console.log('Service worker registered'));
    });
}

const CACHE_NAME = 'boosterlander-game-cache';
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
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('cache opened');
            return cache.addAll(cacheAssets);
        })
    );
});

self.addEventListener('fetch', function(event){
    event.respondWith(
        caches.match(event.request)
        .then(function(response){
            if(response){
                return response;
            }

            var fetchClonedRequest = event.request.clone();

            return fetch(fetchClonedRequest).then(function(response){

                if(!response || !response.status.toString().match(/^200$|^206$/) || response.type !== 'basic'){
                    return response;
                }

                var clonedResponseToCache = response.clone();

                caches.open(CACHE_NAME)
                .then(function(cache){
                    cache.put(event.request, clonedResponseToCache);
                });

                return response;

            })
        })
    );
});
