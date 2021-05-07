Notification.requestPermission();
var gamePausedNotification;

fetch('app/languages/languages.json')
.then((response)=> response.json()
        .then((jsonResponse)=> {
        siteLanguages = jsonResponse;
        setSiteLanguage();
    })
);

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

    window.addEventListener('blur' , function(e){
        if(game.status === 'started'){

            game.pause();
            
            if(Notification.permission === 'granted'){
                gamePausedNotification = new Notification(siteText.gamePaused, {icon: 'icons/favicon.png'});
            }
        }
    });

    window.addEventListener('focus', function(e){
        typeof  gamePausedNotification !== 'undefined' ?    gamePausedNotification.close() : undefined;
    });

}



