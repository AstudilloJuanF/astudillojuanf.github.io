                                    /* Service Worker*/

// Name of the cache
const CACHE_NAME = 'boosterlander-game-cache';

// Application root path
const APP_PATH = '/boosterlander';

// App assets to be stored in the cache
var cacheAssets = [
`${APP_PATH}/index.html`,
`${APP_PATH}/styles/styles.css`,
`${APP_PATH}/icons/favicon.svg`,
`${APP_PATH}/icons/favicon.png`,
`${APP_PATH}/game/languages/languages.json`,
`${APP_PATH}/game/bin/javascript/boosterlander.js`,
`${APP_PATH}/game/sounds/blip-start.mp3`,
`${APP_PATH}/game/sounds/blip.mp3`,
`${APP_PATH}/game/sounds/switch.mp3`,
`${APP_PATH}/game/sounds/swoosh.mp3`,
`${APP_PATH}/game/sounds/sonic-boom.mp3`,
`${APP_PATH}/game/sounds/rumble.mp3`,
`${APP_PATH}/game/sounds/water.mp3`,
`${APP_PATH}/game/sounds/explosion.mp3`,
];

// Install service worker and store assets in the cache
self.addEventListener('install', function(event){
    console.log('Service worker: Installed');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(function(cache){
            console.log('Service worker: Storing assets in the cache...');
            return cache.addAll(cacheAssets)
            .then(()=> console.log('Service worker: Web application assets stored in the cache'));
        })
    );
});

// Ask the user to allow notifications
self.addEventListener('appinstalled', function(){
    Notification.requestPermission();
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
        }).catch(fetchError => caches.match(fetchEvent.request).then(cacheResponse => cacheResponse))
    );
})

// Handle notifications
self.addEventListener('notificationclick', function(clickEvent){

    if(clickEvent.action === 'close'){
        clickEvent.notification.close();
    }

    if(clickEvent.action === 'go' || clickEvent.action !== 'close'){
        clickEvent.waitUntil(
            clients.matchAll({ type: 'window' }).then(function(clientsArr){
    
                const hadWindowToFocus = clientsArr.some(function(windowClient){
                        windowClient.url === clickEvent.notification.data.url ? (windowClient.focus(), true) : false;
                    });
    
                if(!hadWindowToFocus){
                        clients.openWindow(clickEvent.notification.data.url).then(windowClient => windowClient ? windowClient.focus() : null);
                };
            })
        );
    }
});