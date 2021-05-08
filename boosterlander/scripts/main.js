// Registers the ServiceWorker
if('serviceWorker' in navigator){
    console.log('The browser has serviceWorker support');
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js')
        .then( success => console.log('Service worker: Registered'));
    });
}else{
    console.warn('The browser does not have serviceWorker support');
}

// Variable that stores the languages file
var siteLanguages;

// Fetch languages file for the site
fetch('app/languages/languages.json')
.then((response)=> response.json()
        .then((jsonResponse)=> {
        siteLanguages = jsonResponse;
        setSiteLanguage();
    })
);

// Functions that sets the site's language
function setSiteLanguage(){
    
    var page = document.getElementsByTagName('html')[0];
    var siteGameDescription = document.getElementById('game-description-text');
    var underDevelopment = document.getElementById('game-development-text');
    var homepage = document.getElementById('homepage-anchor');
    var author = document.getElementById('author-text');

    var siteLang = navigator.language.substr(0,2);
    var siteText;

    siteText = siteLanguages.english;

    switch (siteLang){
        case 'es':
            siteText = siteLanguages.spanish;
        break;
        case 'en':
            siteText = siteLanguages.english;
        break;
        case 'de':
            siteText = siteLanguages.german;
        break;
        case 'ja':
            siteText = siteLanguages.japanese;
        break;
    }
    
    page.lang = siteLang;
    siteGameDescription.innerText = siteText.gameDescription;
    underDevelopment.innerText = siteText.underDevelopment;
    homepage.innerText = siteText.homepage;
    author.innerText = siteText.author;

    window.addEventListener('blur' , function(){
        if(game.status === 'started' || game.status === 'paused'){

            if(game.status === 'started'){
                game.pause();
            }
            
            if(Notification.permission === 'granted'){

                var notificationTitle = 'Booster Lander';
                var notificationObject = {
                    icon: 'icons/favicon.png',
                    body: siteText.gamePaused,
                    lang: siteLang,
                    vibrate: [100, 50, 100],
                    data: {
                        primaryKey: 1,
                        url: self.location.href
                    },
                    tag: 'boosterlander-notification',
                    actions: [
                        {
                            action: 'go',
                            title: siteText.resume
                           
                        },
                        {
                            action: 'close',
                            title: siteText.close
                        }
                    ]
                }

                navigator.serviceWorker.getRegistration()
                .then((registration) => {
                    registration.showNotification(notificationTitle, notificationObject);
                });
            }
        }
    });

    window.addEventListener('focus', function(){
        if(Notification.permission === 'granted'){
            navigator.serviceWorker.ready.then(function(registration){
                registration.getNotifications({tag: 'boosterlander-notification'}).then(function(notifications){
                    typeof notifications[0] !== 'undefined' ? notifications[0].close() : undefined;
                })
            });
        }
    });

}



