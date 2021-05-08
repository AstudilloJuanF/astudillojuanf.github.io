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

// Notification button state
var notificationButtonEnabled;

Notification.permission === 'granted' ? notificationButtonEnabled = true : notificationButtonEnabled = false;

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

// HTML Elements
var page = document.getElementsByTagName('html')[0];
var siteGameDescription = document.getElementById('game-description-text');
var underDevelopment = document.getElementById('game-development-text');
var homepage = document.getElementById('homepage-anchor');
var author = document.getElementById('author-text'); 

var notificationsBtn = document.getElementById('notifications-button');
var notificationsBtnLabel = document.getElementById('notifications-button').previousElementSibling;
var separators = document.getElementsByClassName('separator');

// Functions that sets the site's language
var navigatorLang = navigator.language.substr(0,2);
var siteText;

function setSiteLanguage(){

    siteText = siteLanguages.english;

    switch (navigatorLang){
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
    
    page.lang = navigatorLang;
    siteGameDescription.innerText = siteText.gameDescription;
    underDevelopment.innerText = siteText.underDevelopment;
    homepage.innerText = siteText.homepage;
    author.innerText = siteText.author;
    notificationsBtnLabel.innerText = siteText.notifications;

    if(notificationButtonEnabled === true){
        notificationsBtn.innerText = siteText.disable;
    } else {
        notificationsBtn.innerText = siteText.enable;
    }
}

// Toggle notifications button

notificationsBtn.onclick = () => {
    if(Notification.permission !== 'granted' || notificationButtonEnabled === false){
        Notification.requestPermission().then(result => {
            if (result === 'granted'){
                notificationsBtn.innerText = siteText.disable;
                sounds.menuBlip.play();

                notificationButtonEnabled = true;
            }
        });
    } else {
        notificationsBtn.innerText = siteText.enable;
        sounds.switch.play();

        notificationButtonEnabled = false;
    }
};

window.addEventListener('blur' , function(){
    if(game.status === 'started' || game.status === 'paused'){

        if(game.status === 'started'){
            game.pause();
        }
        
        if(Notification.permission === 'granted' && notificationButtonEnabled === true){

            var notificationTitle = 'Booster Lander';
            var notificationObject = {
                icon: 'icons/favicon.png',
                body: siteText.gamePaused,
                lang: navigatorLang,
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
    if(Notification.permission === 'granted' && notificationButtonEnabled === true){
        navigator.serviceWorker.ready.then(function(registration){
            registration.getNotifications({tag: 'boosterlander-notification'}).then(function(notifications){
                typeof notifications[0] !== 'undefined' ? notifications[0].close() : undefined;
            })
        });
    }
});



