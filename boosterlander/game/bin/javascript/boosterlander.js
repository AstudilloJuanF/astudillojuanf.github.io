/*
            Booster Lander - Copyright © 2020 Juan Astudillo
            A Moon Lander & SpaceX inspired JavaScript minigame made By AstudilloJuanF
            <astudillojuanfrancisco@gmail.com>


                                        Contact Information:

            Github Page:
            https://github.com/AstudilloJuanF/

            LinkedIn Profile:
            https://wwww.linkedin.com/in/juan-astudillo/

            Email:
            astudillojuanfrancisco@gmail.com
*/

//-------------------------------------------------------------------------------------

const getDeviceOS = function() {

    let platformInfo, platform = '';

    const OS_LIST = [
        'linux',
        'android',
        'mac',
        'ios',
        'iphone',
        'win'
    ];

    if (navigator.platform) {

        platformInfo = navigator.platform;

    } else if (navigator.userAgentData) {

        platformInfo = navigator.userAgentData.platform;
        
    } else {

        platformInfo = navigator.userAgent;
    }

    platformInfo = platformInfo.toLowerCase();
    platform = platformInfo;
    

    OS_LIST.forEach(function(index) {
        platformInfo.includes(index) ? platform = index : undefined;
    });

    platform === 'win' ? platform = 'window' : undefined;

    return platform;
};

const canvasSection = document.getElementById('canvas-section');

const canvas = document.getElementById('canvas-frame');

const ctx = canvas.getContext('2d');

ctx.imageSmoothingEnabled = false;

// Pixels equals meters

const CTX_INITIAL_X_SCALE = 1024;
const CTX_INITIAL_Y_SCALE = 755;

// Earth's Gravity
const EARTH_GRAVITY = 9.80665; // meters per squared seconds;
const MARS_GRAVITY = 3.72076; // meters per squared seconds;

var canvasW = canvas.width;
var canvasH = canvas.height;
var scalingPercentage = 1;

const pauseButton = document.getElementById('pause-game-button');
const exitButton =  document.getElementById('exit-game-button');
const volumeSlider = document.getElementById('volume-slider');
const volumeSliderText = document.getElementById('volume-slider-text');

// hidden canvas & star background canvas

if (window.chrome) {
    var hiddenCanvas = new OffscreenCanvas(CTX_INITIAL_X_SCALE, CTX_INITIAL_Y_SCALE);
    var starsCanvas = new OffscreenCanvas(CTX_INITIAL_X_SCALE, CTX_INITIAL_Y_SCALE);
} else {
    var hiddenCanvas = document.createElement('canvas');
    hiddenCanvas.width = CTX_INITIAL_X_SCALE;
    hiddenCanvas.height = CTX_INITIAL_Y_SCALE;

    var starsCanvas = document.createElement('canvas');
    starsCanvas.width = CTX_INITIAL_X_SCALE;
    starsCanvas.height = CTX_INITIAL_Y_SCALE;

}

const hiddenCtx = hiddenCanvas.getContext('2d');
const starsCtx = starsCanvas.getContext('2d');

// Star background Image
var bgStars, bgStarsDisplay;

function drawStars(starsCount = 100) {
    
    starsCtx.fillStyle = 'black';
    starsCtx.fillRect(0, 0, starsCanvas.width, starsCanvas.height);

    for(var i = 0; i < starsCount; i++) {
        
        var stars = new Path2D();

        starsCtx.fillStyle = 'white';
        stars.arc(Math.random()*starsCanvas.width, Math.random()*starsCanvas.height, 1, 0, Math.PI*2);
        
        starsCtx.fill(stars);
    }

    bgStars = starsCtx.getImageData(0,0, starsCanvas.width, starsCanvas.height);
    bgStarsDisplay = bgStars;
}

drawStars();

// focus the game frame on the screen
function focusGameFrame() {
    game && game.status.match(/started|over/) ? window.scrollTo(0, canvas.offsetTop) : undefined;
    recolorCanvasContainer();
}

canvas.addEventListener('touchstart', focusGameFrame);
canvas.addEventListener('pointerover', focusGameFrame);
canvas.addEventListener('pointermove', focusGameFrame);
screen.orientation.addEventListener('change', focusGameFrame);

// fallback loading message
var loadingScreenInterval;
function displayLoadingScreen() {

    var displayText = function() {
        let lang = navigator.language.slice(0, 2);
        let loadingMsg = 'Loading...'; // Fallback loading message
        let errorMsg = 'Error'; // Fallback error message

        switch(lang) {
            case 'es': // Spanish
                loadingMsg = 'Cargando';
                errorMsg = 'Error';
            break;
            case 'en': // English
                loadingMsg = 'Loading';
                errorMsg = 'Error';
            break;
            case 'de': // German
                loadingMsg = 'Laden';
                errorMsg = 'Fehler';
            break;
            case 'ja': // Japanese
                loadingMsg = '読み込み中';
                errorMsg = 'エラー';
            break;
        }

        if (game.status === 'error') {
            return errorMsg;
        }

        return loadingMsg;
    };

    let dotChar;
    navigator.language.slice(0, 2) === 'ja' ? dotChar = '・' : dotChar = '.';


    let i = 0;
    let suspenseDots = '';
    loadingScreenInterval = null;
    loadingScreenInterval = setInterval(function() {

        if (i < 3) {
            suspenseDots = suspenseDots.concat(dotChar);
            i++;
        } else {
            suspenseDots = '';
            i = 0;
        }

        ctx.save();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.fillStyle = 'white';
        ctx.font = '75px sans serif';
        ctx.textBaseline = 'center';
        ctx.textAlign = 'center'
        ctx.fillText(displayText(), canvasW/2, canvasH/2);
        ctx.fillText(suspenseDots, canvasW/2, canvasH/2 + 75);
        ctx.restore();

        if (typeof languages !== 'undefined') {
            game.status = 'reset';
        }

        if (typeof game !== 'undefined' && game.status !== 'error') {
            clearInterval(loadingScreenInterval);
            displayGameMenu();
        }

    }, 1000);
}

if (typeof languages === 'undefined') {
    displayLoadingScreen();
}

var text, languages;

fetch('game/languages/languages.json')
.then((response)=> response.json().then((responseJSON)=> {
        languages = responseJSON;
    },
    (errorResponse)=> game.status = 'error')
);

function recolorCanvasContainer(color = 'black') {
    if (canvas.height === window.innerHeight && game.status.match(/started|paused|over/)) {
        canvasSection.style.background = color;
        canvasSection.style.color = 'white';

        for(var i = 0; i < separators.length; i++) {
            separators[i].style.background = 'linear-gradient(45deg, transparent,rgba(255,255,255, 0.5), transparent)';
        }

    } else {
        canvasSection.removeAttribute('style');
        
        for(var i = 0; i < separators.length; i++) {
            separators[i].removeAttribute('style');
        }
    }
}


// --------- Game frame resizing function ----------------------- TESTING...
function resizeGame(e) {

    // copy main canvas image into the hidden canvas

    /*
    hiddenCanvas.width = canvas.width;
    hiddenCanvas.height = canvas.height;
    hiddenCanvas.drawImage(canvas,0,0);
    */

    var deviceW = document.body.offsetWidth;
    var deviceH = window.innerHeight;

    // resize main canvas

    ctx.resetTransform();

    if (deviceW < CTX_INITIAL_X_SCALE || deviceH < CTX_INITIAL_Y_SCALE) {

        if (deviceW <= deviceH) {
            scalingPercentage = deviceW / CTX_INITIAL_X_SCALE;
            canvas.width = deviceW;
            canvas.height = Math.floor((CTX_INITIAL_Y_SCALE / CTX_INITIAL_X_SCALE) * deviceW);
            canvas.style.margin = '0';
        } else {
            scalingPercentage = deviceH / CTX_INITIAL_Y_SCALE;
            canvas.height = deviceH;
            canvas.width = Math.floor((CTX_INITIAL_X_SCALE / CTX_INITIAL_Y_SCALE) * deviceH);
            canvas.style.margin = 'auto';
        }

        scalingPercentage > 1 ? scalingPercentage = 1 : undefined;
        ctx.scale(scalingPercentage, scalingPercentage);

        
    } else {
        canvas.width = CTX_INITIAL_X_SCALE;
        canvas.height = CTX_INITIAL_Y_SCALE;
        canvas.style.margin = 'auto';
    }

    if (e.type === 'load') {
        if (game.status.match(/loading|error/)) {
            clearInterval(loadingScreenInterval)
            displayLoadingScreen();
        }
    }

        /* Calling the drawImage or the PutImageData methods instead of this workaround would work for
        resizing the game screen but it would have detrimental effects on the display resolution */

            if (game.status.match(/loaded|reset/)) {
                var menuStatus = menu.current;
                displayGameMenu();
                switch(menuStatus) {
                    case 'instructions':
                        menu.instructions();
                    break;
                    case 'language':
                        menu.language();
                    break;
                    case 'controls':
                        menu.controls();
                    break;
                    case 'settings':
                        menu.settings();
                    break;
                }
            } else {
                if (game.status === 'paused') {
                    model.draw();
                    game.pause();
                }
                if (game.status === 'over') {
                    game.over(
                        game.lastGameOver.message,
                        game.lastGameOver.color,
                        game.lastGameOver.description
                    );
                }
            }
        //------------------------------------------------------

    recolorCanvasContainer();
}

window.addEventListener('load', resizeGame);
window.addEventListener('resize', resizeGame);
screen.orientation.addEventListener('change', resizeGame);

// -------------------------------------------------------


var startGameBtn = new Path2D();
var exitGameBtn = new Path2D();
var resumePauseGameBtn = new Path2D();
var menuBackgroundTouchArea = new Path2D();
var menuControlsBtn = new Path2D();
var menuInstructionsBtn = new Path2D();
var menuSettingsBtn = new Path2D();
var menuLangBtn = new Path2D();
var menuLangLeftArrow = new Path2D();
var menuLangRightArrow = new Path2D();
var spanishLangBtn = new Path2D();
var englishLangBtn = new Path2D();
var germanLangBtn = new Path2D();
var japaneseLangBtn = new Path2D();
var menuModelLeftArrow = new Path2D();
var menuModelRightArrow = new Path2D();
var spacecraftSelectorBtn = new Path2D();

var volumeMuteBtn = new Path2D();
var volumeMaxBtn = new Path2D();
var volumeBtn = {
    bar: new Path2D(),
    width: 270,
    maxWidth: 270
}


var landingPlatform = new Path2D();

var lEngineExhaust = new Path2D();
var rEngineExhaust = new Path2D();
var mainEngineExhaust = new Path2D();

// animation frames per second
if (getDeviceOS() === 'windows') {
    var fps = 1000;
} else {
    var fps = 60;
}

// function to convert degrees to radians
function toRadians(degrees){

    return degrees * Math.PI / 180;
}

// Pending: To convert loose physical objects into class objects in order to organize the code and handle physics better
class PhysicalObject {
    constructor(posX = 0, posY = 0, width = 0, height = 0, radius = undefined, speedX = 0, speedY = 0, mass = undefined) {
        this.x = posX; // Meters
        this.y = posY; // Meters
        this.width = width; // Meters
        this.height = height; // Meters
        this.radius = radius; // Meters
        this.vx = speedX; // Meters per Seconds
        this.vy = speedY; // Meters per Seconds
        this.mass = mass; // Kg
        this.boundaries = function() {
            if (this.y >= canvasH - this.height || this.y + this.vy < 0) {
                this.vy = -this.vy;
                this.vy /= 2;
            }
            if (this.x + this.vx > canvasW - this.width || this.x + this.vx < 0) {
                this.vx = -this.vx;
            }
        }
    }
};

var meteorite;
var meteor = new PhysicalObject(Math.random() * canvasW, 0, undefined, undefined, 5, 60, 178.816, undefined);
meteor.draw = function() {

    if (meteor.y === 0) {
        sounds.meteor.play();
        meteor.x = Math.random()*canvasW;
        meteor.x <= canvasW/2 ? meteor.vx = Math.random() * 8.9408 : meteor.vx = Math.random() * -8.9408;
        meteor.y += meteor.vy/fps;
    }

    meteor.x += meteor.vx;
    meteor.y + meteor.radius < canvasH ? meteor.y += meteor.vy/fps : (stopAudio(sounds.meteor), meteor.y = 0);
    meteor.x + meteor.radius <= 0 || meteor.x + meteor.radius >= canvasW ? (stopAudio(sounds.meteor), meteor.y = 0) : undefined;
   
    ctx.save();

    var meteorHalo = ctx.createRadialGradient(meteor.x, meteor.y, meteor.radius/2, meteor.x, meteor.y, meteor.radius*2);
    meteorHalo.addColorStop(0, 'white');
    meteorHalo.addColorStop(0.5, 'rgba(255,255,255, 0.25)');
    meteorHalo.addColorStop(1, 'rgba(255,255,255, 0)');

    var meteorTrailGradient = ctx.createLinearGradient(meteor.x, meteor.y,meteor.x - meteor.vx*fps, meteor.y - meteor.vy);
    meteorTrailGradient.addColorStop(0, 'rgba(255,255,255, 0.75)');
    meteorTrailGradient.addColorStop(0.25, 'rgba(0,255,255, 0.5)');
    meteorTrailGradient.addColorStop(0.50, 'rgba(255,255,255, 0.25)');
    meteorTrailGradient.addColorStop(0.75, 'rgba(255,255,0, 0.25)');
    meteorTrailGradient.addColorStop(1, 'rgba(255,255,0, 0.125)');


    var meteorTrail = new Path2D();

    ctx.fillStyle = meteorTrailGradient;
    meteorTrail.moveTo(meteor.x - meteor.radius, meteor.y);
    meteorTrail.lineTo(meteor.x - meteor.vx*fps, meteor.y - meteor.vy);
    meteorTrail.lineTo(meteor.x + meteor.radius, meteor.y);
    ctx.fill(meteorTrail);

    meteorite = new Path2D();
    meteorite.arc(meteor.x, meteor.y, meteor.radius*2, 0, Math.PI*2);
    ctx.fillStyle = meteorHalo;
    ctx.fill(meteorite);

    if (meteor.y + meteor.radius*2 >= canvasH) {

        sounds.impact.play();
        
        var meteorImpact = new Path2D();

        var meteorImpactGradient = ctx.createRadialGradient(meteor.x, canvasH, 0, meteor.x, canvasH, 100);
        meteorImpactGradient.addColorStop(0, 'rgba(255,255,255, 0.5)');
        meteorImpactGradient.addColorStop(1, 'transparent');

        meteorImpact.arc(meteor.x, canvasH, 100, 0, Math.PI*2);
        ctx.fillStyle = meteorImpactGradient;
        ctx.fill(meteorImpact);
    }
    
    ctx.restore();
};

var sounds = {
    menuStart: new Audio('game/sounds/blip-start.mp3'),
    menuBlip: new Audio('game/sounds/blip.mp3'),
    switch: new Audio('game/sounds/switch.mp3'),
    meteor: new Audio('game/sounds/swoosh.mp3'),
    impact: new Audio('game/sounds/sonic-boom.mp3'),
    engines: new Audio('game/sounds/rumble.mp3'),
    water: new Audio('game/sounds/water.mp3'),
    waterSplash: new Audio('game/sounds/big-water-splash.mp3'),
    explosion: new Audio('game/sounds/explosion.mp3')
};

function stopAudio(element) {
    element.pause();
    element.currentTime = 0;
}

function stopSounds() {
    Object.values(sounds).forEach(
        function(e){
            stopAudio(e);
        }
    );
}

// cronometer object and methods
var cronometer = {
    hours: 0,
    mins: 0,
    secs: 0,
    elapsed: '0s',
    cronometerCount: undefined,
    start: function() {
        this.cronometerCount = setInterval(function() {

            ++cronometer.secs;

            if (cronometer.secs === 60) {cronometer.secs = 0; cronometer.mins++;}

            if (cronometer.mins === 60) {cronometer.secs = 0; cronometer.hours++;}

            if (cronometer.mins === 0 && cronometer.hours === 0) {
                cronometer.elapsed = `${cronometer.secs + text.seconds}`;
            } else if (cronometer.hours === 0) {
                cronometer.elapsed = `${cronometer.mins + text.minutes}: ${cronometer.secs + text.seconds}`;
            } else {
                cronometer.elapsed = `${cronometer.hours + text.hours}: ${cronometer.mins + text.minutes}: ${cronometer.secs + text.seconds}`;
            }
        },1000);
    },
    pause: function() {
        clearInterval(this.cronometerCount.valueOf());
    },
    stop: function() {

        this.hours = 0, this.mins = 0, this.secs = 0;
        this.elapsed = '0s';

        clearInterval(this.cronometerCount.valueOf());
    }
}

var spaceShip = {
    name: 'spaceship',
    color: 'silver',
    stroke: 'rgba(0,0,0, 0.5)',
    legsLength: 3,
    fuelCapacity: 500000,
    fuel: 500000,
    width: 9.1440,
    height: 71.9328 + 5,
    legsExtension: 0,
    mass: undefined
};

var booster = {
    name: 'booster',
    color: 'white',
    stroke: 'rgba(0,0,0, 0.25)',
    legsLength: 3.6576 * 3,
    legsRotation: 115,
    fuelCapacity: 245620,
    fuel: 245620,
    width: 3.6576,
    height: 70.1040 + 5,
    mass: 549054
};

// rocket object
var gameModel = booster;

// Game object and methods
var game = {
    language: 'en',
    langInt: 1,
    langArray: ['es', 'en', 'de', 'ja'],
    lastGameOver: {
        color: undefined,
        message: undefined,
        description: undefined
    },
    currentSpacecraft: gameModel,
    status: 'loading',
    graphics: 'medium',
    volume: 1,
    difficulty: undefined,
    levels: 4,
    level: 1,
    scenario: 'ground',
    sky: 'day',
    gravity: undefined,
    points: undefined,
    start: function() {
        
        pauseButton.innerText = text.pause;
        exitButton.innerText = text.exit;

        menu.active = false;
        game.status = 'started';
    
        sounds.menuStart.play();

        toggleExitButton();

        game.scenario = 'ground';

        focusGameFrame();

        // Fix behavior of the scenario() function and avoid redundances

        game.level === 1 ? game.scenario = 'ground' : undefined;
        game.level === 2 ? game.scenario = 'ground' : undefined;
        game.level === 3 ? game.scenario = 'ocean' : undefined;
        game.level === 4 ? game.scenario = 'ocean' : undefined;

        stopAudio(sounds.engines);
        stopAudio(sounds.explosion);

        game.scenario === 'ocean' ? sounds.water.play() : undefined;

        platform.x = Math.abs(Math.random() * canvasW - platform.width);

        model.status = 're-entry';

        // model.x = canvasW / 2; ----fixed initial position for low difficulty
        model.x = Math.abs(Math.random() * canvasW - model.width); // Random initial position
        model.y = 0;
        model.vx = 0;
        model.vy = 0;
        model.legsRotation = 115;
        model.fuel = model.fuelCapacity;
        model.update(game.currentSpacecraft);

        meteor.y = 0;

        canvas.removeEventListener('click', gameOverInput);

        clearCanvas();
        cronometer.start();


        physics(EARTH_GRAVITY);
        model.draw();

        document.addEventListener('keydown', gameplayInput);
        document.addEventListener('keypress', gameplayInput);
        document.addEventListener('keyup', gameplayInput);

        canvas.addEventListener('pointermove', gameplayInput);
        canvas.addEventListener('click', gameplayInput);

    },
    resume: function() {

        pauseButton.innerText = text.pause;

        game.status = 'started';
        sounds.menuStart.play();

        clearCanvas();
        cronometer.start();
        physics(EARTH_GRAVITY);
        model.draw();

        game.scenario === 'ocean' ? sounds.water.play() : undefined;

        canvas.removeEventListener('click', game.resume);
    },
    pause: function() {

        pauseButton.innerText = text.resume;

        game.status = 'paused';
        stopSounds();

        sounds.menuBlip.play();

        cronometer.pause();
        clearInterval(physicsInterval.valueOf());

        ctx.save();

        ctx.fillStyle = 'rgba(0,0,0, 0.5)';
        ctx.fillRect(0, 0, canvasW, canvasH);
        ctx.strokeStyle = 'dimgray'
        ctx.fillStyle = 'white';
        ctx.font = '25px sans-serif';
        if (platform.x + platform.width/2 < canvasW/2) {
            ctx.textAlign = 'start';
            var textMargin = 0;
        } else {
            ctx.textAlign = 'end';
            var textMargin = canvasW;
        }
        ctx.fillText(text.quitGame, Math.abs(textMargin - 25), canvasH - 25);
        ctx.strokeText(text.quitGame, Math.abs(textMargin - 25), canvasH - 25);
        ctx.font = '50px sans-serif';
        ctx.textAlign = 'center';
        ctx.strokeText(text.resume, canvasW/2, canvasH/2);
        ctx.fillText(text.resume, canvasW/2, canvasH/2);

        drawGameplayButtons();

        ctx.restore();

        canvas.addEventListener('click', this.resume);

    },
    over: function(message, color = 'red', description) {

        this.lastGameOver.message = message; 

        this.lastGameOver.color = color; 

        !message ? message = text.gameover : undefined;
        this.status = 'over';
        cronometer.stop();
        stopAudio(sounds.engines);
        stopAudio(sounds.water);

        model.status === 'landed' ? pauseButton.innerText = `${text.next}` : pauseButton.innerText = `${text.retry}`;;

        canvas.removeEventListener('click', game.resume);
        ctx.resetTransform();
        scalingPercentage !== 0 ? ctx.scale(scalingPercentage, scalingPercentage) : undefined;

        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvasW, canvasH);

        drawGameplayButtons();

        ctx.fillStyle = 'gray';
        ctx.font = '25px sans-serif';
        if (platform.x + platform.width/2 < canvasW/2) {
            ctx.textAlign = 'start';
            var textMargin = 0;
        } else {
            ctx.textAlign = 'end';
            var textMargin = canvasW;
        }
        ctx.fillText(text.quitGame, Math.abs(textMargin - 25), canvasH - 25);

        game.language === 'ja' ? ctx.font = '50px sans-serif': ctx.font = 'bold 50px sans-serif';
        ctx.fillStyle = color;
        ctx.textAlign = 'center';
        ctx.fillText(message, canvasW/2, canvasH/5*2);
        ctx.fillStyle = 'white';
        ctx.font = '50px sans-serif';

        var successsFailureMsg;
        model.status === 'landed' ? successsFailureMsg = text.next : successsFailureMsg = text.retry;

        ctx.fillText(successsFailureMsg, canvasW/2, canvasH/5*3);

        ctx.font = '35px sans-serif';
        if (model.status === 'crashed') {
            ctx.fillText(text.rocketCrashed, canvasW/2, canvasH/5*1);
            ctx.fillStyle = 'lightgray';

            if (game.language === 'es') {
                var gameOverMsg = ['¡Pero la gente cool no observa las explosiones!', 'El cohete explotó, pero nosotros no podemos', 'Desensamblaje rápido no programado', 'El aterrizaje falló exitosamente', 'Ey, no es mi culpa, no existe el abajo en el espacio', 'En el espacio, nadie puede oirte explotar'];
            } else {
                var gameOverMsg = ['But cool guys don\'t look at the explosions!', 'The rocket couldn\'t keep it together, but we can', 'Rapid unscheduled disassembly', 'The landing has failed successfully', 'Hey, it\'s not my fault, there is no bottom in space', 'In space, no one can hear you explode'];
            }

            gameOverMsg = gameOverMsg[Math.floor(Math.random()*gameOverMsg.length)];
            description ? gameOverMsg = description : undefined;

            ctx.fillText(gameOverMsg, canvasW/2, canvasH/8*2.25);

            this.lastGameOver.description = gameOverMsg;

        } else if (model.status === 'missed target') {
            ctx.fillStyle = 'gray';

            if (game.language === 'es') {
                var gameOverMsg = ['Encuentro tu falta de puntería... inquietante', 'Los cohetes son demasiado caros para prácticar dianas', '¡Te dije que debiamos pedir direcciones!', 'El cohete está perdido, ¿Pero no lo hemos estado todos?'];
            } else {
                var gameOverMsg = ['I find your lack of aiming... disturbing', 'Rockets are too expensive for target practice', 'I told you we should have asked for directions!', 'The rocket lost it\'s course, but haven\'t we all at some point?'];
            }

            gameOverMsg = gameOverMsg[Math.floor(Math.random()*gameOverMsg.length)];
            description ? gameOverMsg = description : undefined;

            ctx.fillText(gameOverMsg, canvasW/2, canvasH/6*3);

            this.lastGameOver.description = gameOverMsg;
    
        } else if (message === text.unstableLanding) {
            ctx.fillText('Per aspera ad astra', canvasW/2, canvasH/8*2.25);
        }

        if (game.level !== game.levels) {
            model.status === 'landed' ? game.level++ : undefined;
            canvas.addEventListener('click', gameOverInput);
        } else {
            if (model.status !== 'landed') {
                canvas.addEventListener('click', gameOverInput);
            } else {
                setTimeout( ()=> this.reset(), 1000);
            }
        }
    },
    reset: function() {
        
        this.status = 'reset';

        sounds.switch.play();
        
        cronometer.cronometerCount !== undefined ? cronometer.stop() : undefined;

        document.removeEventListener('keydown', gameplayInput);
        document.removeEventListener('keypress', gameplayInput);
        document.removeEventListener('keyup', gameplayInput);

        canvas.removeEventListener('pointermove', gameplayInput);
        canvas.removeEventListener('click', gameplayInput);

        canvas.removeEventListener('click', game.resume);

        canvas.removeEventListener('click', gameOverInput);

        clearInterval(physicsInterval.valueOf());

        displayGameMenu();
    }
};

game.language = navigator.language.slice(0,2);
game.langInt = game.langArray.indexOf(game.language);

function setLanguage() {
    if (game.language.match(/^es|^en|^de|^ja/)) {
        game.language === 'es' ? text = languages.spanish : undefined;
        game.language === 'en' ? text = languages.english : undefined;
        game.language === 'de' ? text = languages.german : undefined;
        game.language === 'ja' ? text = languages.japanese : undefined;
    } else {
        text = languages.english;
    }
}

var menu = {
    active: undefined,
    current: 'welcome',
    drawBackground: function() {
        drawRocket();

        ctx.save();

        ctx.fillStyle = 'black';
        ctx.fillRect(canvasW/2, 0, canvasW, canvasH - canvasW/20);

        ctx.fillStyle = 'rgba(0,0,0, 0.5)';
        ctx.fillRect(0, 0, canvasW/2, canvasH);

        ctx.font = '25px sans-serif';
        ctx.fillStyle = 'white';
        ctx.textBaseline = 'center';
        //ctx.textAlign = 'start';
        ctx.textAlign = 'center';
        //ctx.fillText(text.goBack, 15, 35);
        ctx.fillText(text.goBack, canvasW/4, canvasH/2);

        menuBackgroundTouchArea.rect(0, 0, canvasW/2, canvasH);

        ctx.restore();
    },
    controls: function() {

        this.current = 'controls';
        toggleExitButton();
        

        ctx.save();

        this.drawBackground();

        ctx.fillStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.fillText(text.controls, canvasW/6*4, canvasH/8);

        ctx.font = '22px sans-serif';

        ctx.fillStyle = 'skyblue';
        ctx.fillText(text.rocket, canvasW/20*11, canvasH/10*2);
        ctx.fillStyle = 'red';
        ctx.fillText(text.menu, canvasW/20*11, canvasH/10*7);

        ctx.font = '20px sans-serif';

        ctx.fillStyle = 'lightgray';
        ctx.fillText(text.fullThrust, canvasW/20*11.5, canvasH/10*3);
        ctx.fillText(text.up, canvasW/20*11.5, canvasH/10*4);
        ctx.fillText(text.left, canvasW/20*11.5, canvasH/10*5);
        ctx.fillText(text.right, canvasW/20*11.5, canvasH/10*6);

        ctx.fillText(`${text.pause} / ${text.resume}`, canvasW/20*11.5, canvasH/10*8);
        ctx.fillText(`${text.exit} / ${text.back}`, canvasW/20*11.5, canvasH/10*9);

        ctx.fillStyle = 'black';
        ctx.font = '18px sans-serif';
        ctx.textAlign = 'start';
        ctx.textBaseline = 'top';

        ctx.clearRect(canvasW/20*15.5, canvasH/10*3 - 15, 30, 30);
        ctx.fillText('L', canvasW/20*15.5 + 5, canvasH/10*3 - 10);

        ctx.clearRect(canvasW/20*16.5, canvasH/10*3 - 15, ctx.measureText(text.space).width + 10, 30);
        ctx.fillText(text.space, canvasW/20*16.5 + 5, canvasH/10*3 - 10);

        ctx.clearRect(canvasW/20*15.5, canvasH/10*4 - 15, 30, 30);
        ctx.fillText('W', canvasW/20*15.5 + 5, canvasH/10*4 - 10);

        ctx.clearRect(canvasW/20*16.5, canvasH/10*4 - 15, ctx.measureText(`${text.mouse} ${text.forward}`).width + 10, 30);
        ctx.fillText(`${text.mouse} ${text.forward}`, canvasW/20*16.5 + 5, canvasH/10*4 - 10);

        ctx.clearRect(canvasW/20*15.5, canvasH/10*5 - 15, 30, 30);
        ctx.fillText('A', canvasW/20*15.5 + 5, canvasH/10*5 - 10);

        ctx.clearRect(canvasW/20*16.5, canvasH/10*5 - 15, ctx.measureText(`${text.mouse} ${text.left}`).width + 10, 30);
        ctx.fillText(`${text.mouse} ${text.left}`, canvasW/20*16.5 + 5, canvasH/10*5 - 10);

        ctx.clearRect(canvasW/20*15.5, canvasH/10*6 - 15, 30, 30);
        ctx.fillText('D', canvasW/20*15.5 + 5, canvasH/10*6 - 10);

        ctx.clearRect(canvasW/20*16.5, canvasH/10*6 - 15, ctx.measureText(`${text.mouse} ${text.right}`).width + 10, 30);
        ctx.fillText(`${text.mouse} ${text.right}`, canvasW/20*16.5 + 5, canvasH/10*6 - 10);

        ctx.clearRect(canvasW/20*15.5, canvasH/10*8 - 15, 30, 30);
        ctx.fillText('P', canvasW/20*15.5 + 5, canvasH/10*8 - 10);

        ctx.clearRect(canvasW/20*15.5, canvasH/10*9 - 15, 30, 30);
        ctx.fillText('Esc', canvasW/20*15.4 + 5, canvasH/10*9 - 10);

        ctx.clearRect(canvasW/20*16.5, canvasH/10*9 - 15, ctx.measureText(text.backspace).width + 10, 30);
        ctx.fillText(text.backspace, canvasW/20*16.5 + 5, canvasH/10*9 - 10);

        ctx.restore();
    },
    instructions: function() {

        this.current = 'instructions';
        toggleExitButton();

        ctx.save();

        this.drawBackground();

        ctx.fillStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text.instructions, canvasW/8*6, canvasH/8);

        ctx.font = '15px monospace'
        ctx.textAlign = 'start';

        var linePosition = 4;
        var charLimit = 50;
        var pointerCorrection = 0;
        var instructionsText = text.instructionsDescription;

        for (var i = 0; i < instructionsText.length; i += charLimit) {

            i -= pointerCorrection;
            pointerCorrection = 0;

            instructionsText.substr(i, charLimit).startsWith(' ') ? i++ : undefined;
            
            if (!instructionsText.substr(i, charLimit).endsWith(' ') && !instructionsText.substr(i, charLimit + 1).endsWith(' ')) {
            
               pointerCorrection = instructionsText.substr(i, charLimit).length - instructionsText.substr(i, charLimit).lastIndexOf(' ');
               charLimit -= pointerCorrection;
            }

            

            ctx.fillText(instructionsText.substr(i, charLimit), canvasW/20*10.5, canvasH/20*linePosition);
            charLimit = 50;
            linePosition++;
        }

        menuControlsBtn = new Path2D();
        ctx.lineWidth = 2;
        ctx.fillStyle = 'blue';
        ctx.font = '40px sans-serif';
        ctx.textBaseline = 'top';
        ctx.textAlign = 'center';

        menuControlsBtn.rect(canvasW/6*4 - 1, canvasH/6*5 - 1, ctx.measureText(text.controls).width, 40);
        ctx.fillText(text.controls, canvasW/6*4.5, canvasH/6*5);

        ctx.restore();
    },
    language: function() {

        this.current = 'language';
        toggleExitButton();
        this.current === 'language' ? setLanguage() : undefined;

        exitButton.innerText = text.back;
        pauseButton.innerText = text.start;

        ctx.save();
        this.drawBackground();

        ctx.fillStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text.language, canvasW/8*6, canvasH/8);

        ctx.font = '35px sans-serif';

        var selectedLanguage;

        game.language === 'es' ? selectedLanguage = text.spanish : undefined;
        game.language === 'en' ? selectedLanguage = text.english : undefined;
        game.language === 'de' ? selectedLanguage = text.german : undefined;
        game.language === 'ja' ? selectedLanguage = text.japanese : undefined;

        ctx.fillStyle = 'gray';
        ctx.fillText(selectedLanguage, canvasW/8*6, canvasH/8*2);

        ctx.fillStyle = 'white';
        ctx.fillText(text.spanish, canvasW/8*6, canvasH/8*4);
        ctx.fillText(text.english, canvasW/8*6, canvasH/8*5);
        ctx.fillText(text.german, canvasW/8*6, canvasH/8*6);
        ctx.fillText(text.japanese, canvasW/8*6, canvasH/8*7);


        langSelectorBtn = new Path2D();

        langSelectorBtn.rect(canvasW/8*6 - 100, canvasH/8*2 - 30, 200, 50);

        menuLangLeftArrow = new Path2D();
        menuLangLeftArrow.moveTo(canvasW/8*6 - 110, canvasH/8*2 - 30);
        menuLangLeftArrow.lineTo(canvasW/8*6 - 110, canvasH/8*2 + 10);
        menuLangLeftArrow.lineTo(canvasW/8*6 - 130, canvasH/8*2 - 10);
        ctx.fill(menuLangLeftArrow);

        menuLangRightArrow = new Path2D();
        menuLangRightArrow.moveTo(canvasW/8*6 + 110, canvasH/8*2 - 30);
        menuLangRightArrow.lineTo(canvasW/8*6 + 110, canvasH/8*2 + 10);
        menuLangRightArrow.lineTo(canvasW/8*6 + 130, canvasH/8*2 - 10);
        ctx.fill(menuLangRightArrow);

        var textWidth = (text)=> ctx.measureText(text).width;

        spanishLangBtn = new Path2D();
        spanishLangBtn.rect(canvasW/8*6-textWidth(text.spanish)/2, canvasH/8*4 - 35, textWidth(text.spanish), 50);

        englishLangBtn = new Path2D();
        englishLangBtn.rect(canvasW/8*6-textWidth(text.english)/2, canvasH/8*5 - 35, textWidth(text.english), 50);

        germanLangBtn = new Path2D();
        germanLangBtn.rect(canvasW/8*6-textWidth(text.german)/2, canvasH/8*6 - 35, textWidth(text.german), 50);

        japaneseLangBtn = new Path2D();
        japaneseLangBtn.rect(canvasW/8*6-textWidth(text.japanese)/2, canvasH/8*7 - 35, textWidth(text.japanese), 50);

        ctx.fillStyle = 'forestgreen';

        ctx.beginPath();

        var greenCircleXYArray = function() {
            if (game.language === 'es') {return [textWidth(text.spanish), canvasH/8*4]};
            if (game.language === 'en') {return [textWidth(text.english), canvasH/8*5]};
            if (game.language === 'de') {return [textWidth(text.german), canvasH/8*6]};
            if (game.language === 'ja') {return [textWidth(text.japanese), canvasH/8*7]};
        };

        ctx.arc(canvasW/8*6 - greenCircleXYArray()[0]/2 - 40, greenCircleXYArray()[1] - 12.5, 12.5, 0, Math.PI*2);
        ctx.closePath();
        ctx.fill();

        ctx.restore();
    },
    settings: function() {

        this.current = 'settings';
        toggleExitButton();

        menu.changeVolume((volumeBtn.width * 100 / volumeBtn.maxWidth), false);

        ctx.save();
        this.drawBackground();

        ctx.fillStyle = 'white';
        ctx.font = '40px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(text.settings, canvasW/8*6, canvasH/8);

        ctx.font = '30px sans-serif';
        ctx.fillText(text.spacecraft, canvasW/8*6, canvasH/8*2);

        spacecraftSelectorBtn = new Path2D();

        spacecraftSelectorBtn.rect(canvasW/8*6 - 100, canvasH/8*3 - 30, 200, 50);

        menuModelLeftArrow = new Path2D();
        menuModelLeftArrow.moveTo(canvasW/8*6 - 110, canvasH/8*3 - 30);
        menuModelLeftArrow.lineTo(canvasW/8*6 - 110, canvasH/8*3 + 10);
        menuModelLeftArrow.lineTo(canvasW/8*6 - 130, canvasH/8*3 - 10);
        ctx.fill(menuModelLeftArrow);

        menuModelRightArrow = new Path2D();
        menuModelRightArrow.moveTo(canvasW/8*6 + 110, canvasH/8*3 - 30);
        menuModelRightArrow.lineTo(canvasW/8*6 + 110, canvasH/8*3 + 10);
        menuModelRightArrow.lineTo(canvasW/8*6 + 130, canvasH/8*3 - 10);
        ctx.fill(menuModelRightArrow);

        ctx.fillStyle = 'lightgray';

        ctx.fillText(game.currentSpacecraft.name, canvasW/8*6, canvasH/8*3);

        volumeMuteBtn = new Path2D();
        volumeMuteBtn.rect(canvasW/8*4.15, canvasH/8*5, ctx.measureText(text.mute).width, 30);
        ctx.fillText(text.mute, canvasW/8*4.5, canvasH/8*5 + 25);
        
        volumeMaxBtn = new Path2D();
        volumeMaxBtn.rect(canvasW/8*7.25 + 4, canvasH/8*5, ctx.measureText(text.maximum).width, 30);
        ctx.fillText(text.maximum, canvasW/8*7.5, canvasH/8*5 + 25);

        ctx.fillStyle = 'dimgray';
        volumeBtn.bar = new Path2D();
        volumeBtn.bar.rect(canvasW/8*6 - 130, canvasH/8*5, volumeBtn.maxWidth, 30);
        ctx.fill(volumeBtn.bar);

        ctx.fillStyle = 'white';

        ctx.fillText(text.volume, canvasW/8*6, canvasH/8*4.5);
        
        ctx.stokeStyle = 'white';
        ctx.fillRect(canvasW/8*6 - 130, canvasH/8*5, volumeBtn.width, 30);
        ctx.strokeRect(canvasW/8*6 - 130, canvasH/8*5, volumeBtn.maxWidth, 30);

        ctx.fillStyle = 'black';
        ctx.fillText(Math.floor(game.volume * 100), canvasW/8*6 + 5, canvasH/8*5 + 25);

        ctx.restore();
    },
    changeVolume: function(value, refreshMenu = true) {

        game.volume = value * 0.01;
        volumeBtn.width = volumeBtn.maxWidth * value / 100;
        volumeSliderText.innerText = `${Math.floor(value)}%`;
        volumeSlider.value = value;

        Object.entries(sounds).forEach(([key]) => {
            sounds[key].volume = game.volume;
        });

        if (refreshMenu === true) {
            menu.current === 'settings' ? menu.settings() : null;
        }
    }
};

var model = new PhysicalObject(canvasW / 2, 0, gameModel.width, gameModel.height, undefined, 0, 0, gameModel.mass);

model.update = function(spacecraftModel = booster) {

    gameModel = spacecraftModel;

    game.currentSpacecraft = gameModel;
    
    this.name = gameModel.name;
    this.color = gameModel.color;
    this.legsLength = gameModel.legsLength;

    if (this.name != 'spaceship') {

        this.legsColor = 'black';
        this.legsRotation = gameModel.legsRotation;
    }

    this.stroke = gameModel.stroke;
    this.strokeWidth = ctx.lineWidth;
    this.fuelCapacity = gameModel.fuelCapacity;
    this.fuel = this.fuelCapacity;
    this.width = gameModel.width;
    this.height = gameModel.height;
    this.mass = gameModel.mass;
    this.status = 're-entry';
    this.engineStatus = 'off';
    this.inclination = 0;
    this.inclinationLimit = 15;
};
model.update();

model.draw = function() {

    ctx.save();

    game.level === 2 || game.level === 4 ? setLevelBackground('night') : setLevelBackground('day');

    // Rocket's main body
    ctx.beginPath();

    ctx.fillStyle = this.color;
    ctx.strokeStyle = this.stroke;

    if (gameModel.name === 'booster') {

        ctx.save();

        ctx.translate(this.x, this.y + this.height);

        this.inclination < -this.inclinationLimit ? this.inclination = -this.inclinationLimit : undefined;
        this.inclination > this.inclinationLimit ? this.inclination = this.inclinationLimit : undefined;

        ctx.rotate(Math.PI/180 * this.inclination);

        ctx.fillRect(0, -this.height, this.width, this.height - 5);
        ctx.strokeRect(0, -this.height, this.width, this.height - 5);
        ctx.fillStyle = 'black';
        ctx.fillRect(0, -this.height, this.width, 5);
        ctx.fillRect(-2, -this.height + 6, 2, 1);
        ctx.fillRect(this.width/3, -this.height + 6, this.width/3, 1);
        ctx.fillRect(this.width, -this.height + 6, 2, 1);

            // draw legs

            var leftLeg = new Path2D();
            var rightLeg = new Path2D();
            var centerLeg = new Path2D();

            var rotationChangeVal;
            getDeviceOS() === 'windows' ? rotationChangeVal = 2.5 : rotationChangeVal = 1;

            if (this.y + this.height >= canvasH - 100) {
                if (this.legsRotation > 0) {
                    this.legsRotation -= rotationChangeVal;
                } else {
                    this.legsRotation = rotationChangeVal;
                }
            } else {
                if (this.legsRotation < 115) {
                    this.legsRotation += rotationChangeVal;
                } else {
                    this.legsRotation = 115;
                }
            }

            ctx.save();

            ctx.fillStyle = 'black';

            ctx.fillRect(0, -7, this.width, 3);

            ctx.translate(0, -5);
            leftLeg.moveTo(0, 0);
            leftLeg.lineTo(-this.legsLength, 5);
            leftLeg.lineTo(0, -3);
            ctx.rotate(Math.PI/180*this.legsRotation);
            ctx.fill(leftLeg);
            ctx.resetTransform();
            ctx.restore();

            ctx.fillStyle = 'black';

            ctx.translate(this.width, -5);
            rightLeg.moveTo(0, 0);
            rightLeg.lineTo(this.legsLength, 5);
            rightLeg.lineTo(0, -3);
            ctx.rotate(-Math.PI/180*this.legsRotation);
            ctx.fill(rightLeg);
            ctx.resetTransform();
            ctx.restore();

        ctx.resetTransform();

        ctx.restore();

        ctx.closePath();
    }

    if (gameModel.name === 'spaceship') {

        ctx.save();

        ctx.translate(this.x, this.y + this.height);
        ctx.rotate(Math.PI/180 * this.inclination);

        // rear wings
        
        ctx.fillStyle = '#808087';

        rWingLeft = 6, rWingRight = 6;
        if (engines.status === 'on') {
            this.inclination > 0 ? rWingLeft = 3 : undefined;
            this.inclination < 0 ? rWingRight = 3 : undefined;
        }
        ctx.moveTo(0, -5);
        ctx.lineTo(0 - rWingLeft, -this.height + this.height - 5);
        ctx.lineTo(0 - rWingLeft, -this.height + (this.height/5*4));
        ctx.lineTo(0, -this.height + (this.height/8*5.5));
        ctx.lineTo(0 + this.width, -this.height + (this.height/8*5.5));
        ctx.lineTo(0 + this.width + rWingRight, -this.height + (this.height/5*4));
        ctx.lineTo(0 + this.width + rWingRight, -this.height + this.height - 5);
        ctx.lineTo(0, -this.height + this.height - 5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // nose cone wings
        ctx.beginPath();     
        ctx.moveTo(0, -this.height + (this.height/4));
        ctx.lineTo(0 - 4.5, -this.height + (this.height/4));
        ctx.lineTo(0 - 4.5, -this.height + (this.height/4) - 4.5);
        ctx.lineTo(0 + (this.width/2) - 1,  -this.height - 1);
        ctx.quadraticCurveTo(0 + (this.width/2), -this.height, 0 + (this.width/2) + 1,  -this.height - 1);
        ctx.lineTo(0 + this.width + 4.5, -this.height + (this.height/4) - 4.5);
        ctx.lineTo(0 + this.width + 4.5, -this.height + (this.height/4));
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Spaceship main body;
       
        var spaceshipGradient = ctx.createLinearGradient(0, -this.height/2, this.width, -this.height/2);
        spaceshipGradient.addColorStop(0, '#c0c0c8');
        spaceshipGradient.addColorStop(1, '#808087');
        
        ctx.fillStyle = spaceshipGradient;

        ctx.beginPath();
        ctx.moveTo(0, -this.height + this.height - 5);
        ctx.lineTo(0, -this.height + (this.height/4));
        ctx.quadraticCurveTo(0, -this.height + (this.height/6), 0 + (this.width/2) - 1, -this.height - 1);
        ctx.quadraticCurveTo(0 + (this.width/2), -this.height, 0 + (this.width/2) + 1,  -this.height - 1);
        ctx.quadraticCurveTo(0 + this.width, -this.height + (this.height/6), 0 + this.width, -this.height + (this.height/4));
        ctx.lineTo(0 + this.width, -this.height + this.height -5);
        ctx.closePath();
        ctx.fill();

        // Draws rocket legs when a given altitude is reached
        if (this.y + this.height >= canvasH - 100) {
            gameModel.legsExtension  < 5 ? gameModel.legsExtension += 1/fps : gameModel.legsExtension = 5;

            ctx.fillStyle = gameModel.color;
            ctx.fillRect(0 - 1, -5, 3, gameModel.legsExtension);
            ctx.strokeRect(0 - 1, -5, 3, gameModel.legsExtension);
            ctx.fillRect(0 + (this.width/2) - 1, -5, 3, gameModel.legsExtension);
            ctx.strokeRect(0 + (this.width/2) - 1, -5, 3, gameModel.legsExtension);
            ctx.fillRect(0 + this.width - 2, -5, 3, gameModel.legsExtension);
            ctx.strokeRect(0 + this.width - 2, -5, 3, gameModel.legsExtension);
        } else {
            gameModel.legsExtension  > 0 ? gameModel.legsExtension -= 1/fps : gameModel.legsExtension = 0;
        }


        ctx.resetTransform();
        ctx.restore();    
    }

    gameModel.name === 'spaceship' ? ctx.stroke() : undefined;

    if (model.status === 'crashed') {

        if (game.scenario === 'ocean') {
            if (!ctx.isPointInPath(landingPlatform, model.x - model.legsLength, platform.y) && !ctx.isPointInPath(landingPlatform, model.x + model.width + model.legsLength, platform.y)) {
                sounds.waterSplash.play();
            }
        }
        sounds.explosion.play();

        var explosionRadius = 75;
        var explosionInterval = setInterval(function() {

            var explosionGrad = ctx.createRadialGradient(model.x + model.width/2 ,model.y + model.height - 5,explosionRadius/10,model.x + model.width/2 ,model.y + model.height, explosionRadius);
            explosionGrad.addColorStop(0,'white');
            explosionGrad.addColorStop(0.5,'rgba(255,255,50, 0.25)');
            explosionGrad.addColorStop(0.75,'rgba(255,165,0, 0.125)');
            explosionGrad.addColorStop(1,'transparent');

            ctx.fillStyle = explosionGrad;
            ctx.arc(model.x + model.width/2 ,model.y + model.height - 5, explosionRadius, 0, Math.PI*2);
            ctx.fill();

            explosionRadius <= 160 ? explosionRadius += 10 : clearInterval(explosionInterval.valueOf());
        }, 5);
    }

    stats();

    // Draws Landing target
    platform.draw();

    if (model.status === 'landed') {
        ctx.resetTransform();
        if (model.vx >= -0.1 && model.vx <= 0.1 && ctx.isPointInPath(landingPlatform, model.x + model.width/2, model.y + model.height)) {
            game.over(text.sucessfulLanding, 'limegreen');
        } else if (ctx.isPointInPath(landingPlatform, model.x + model.width/2, model.y + model.height)) {
            game.over(text.unstableLanding, 'yellow');
        }
    } else if (model.status === 'missed target') {
        ctx.resetTransform();
        game.over(text.missedTarget,'orange');
    }

    if (model.status === 'crashed') {
        setTimeout(function() {
            game.over(text.gameover);
        }, 1000);
    }

    drawGameplayButtons();

    ctx.restore();
};

var platform = new PhysicalObject(Math.abs(Math.random() * canvasW - 100), canvasH - 15, 100, 10, undefined, 0.25, 0.25);
platform.draw = function() {

    landingPlatform = new Path2D();

    ctx.save();

    if (game.graphics !== 'low' && game.scenario === 'ocean') {
        var bwy = wy - 2;
        ctx.fillStyle = 'rgb(115,115,206)';
        ctx.beginPath();
        ctx.moveTo(0,bwy);

        for(var i = 0; i <= 10; i++) {
            ctx.bezierCurveTo(i*canvasW/10-canvasW/40, bwy+my, i*canvasW/10-canvasW/40*2 , bwy-my, i*canvasW/10, bwy);
        }

        ctx.lineTo(canvasW, canvasH);
        ctx.lineTo(0, canvasH);
        ctx.closePath();
        ctx.fill();
    }

    landingPlatform.rect(this.x, this.y, this.width, this.height);

    // Ground FX from propellant
    if (game.graphics !== 'low') {

        if (engines.status === 'on' && (model.y + model.height*2) >= platform.y - 40) {

            var groundFXCenter, groundFXColor;

            var arcOrientation = false;
            var arcEndAngle = Math.PI * 2;

            ctx.beginPath();

            if (ctx.isPointInPath(landingPlatform, model.x + model.width/2, platform.y)) {

                if (model.x - 25 > platform.x && model.x + model.width + 25 < platform.x + platform.width) {
                    arcOrientation = true;
                    arcEndAngle = Math.PI;
                }

                ctx.arc(model.x + model.width/2, platform.y, 25, 0, arcEndAngle, arcOrientation);
                groundFXCenter = platform.y;
                groundFXColor = 'rgba(255,255,128, 0.5)';
            } else {
                ctx.arc(model.x + model.width/2, platform.y + platform.height, 25, 0, Math.PI*2);
                groundFXCenter = platform.y + platform.height;
                groundFXColor = 'rgba(255,255,255, 0.5)';
            }
            ctx.closePath();


            var groundFXGradient = ctx.createRadialGradient(model.x + model.width/2, platform.y, 1, model.x + model.width/2, groundFXCenter, 25);
            groundFXGradient.addColorStop(0, 'rgba(255,255,255, 0.75)');
            groundFXGradient.addColorStop(0.5, groundFXColor);
            groundFXGradient.addColorStop(1, 'rgba(255,255,0, 0.0)');

            ctx.fillStyle = groundFXGradient;
            ctx.fill();

            engines.status = 'off';
        }
    }

    if (game.scenario === 'ground') {
        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0, canvasH - 5, canvasW, 5);
    }

    ctx.strokeStyle = 'rgba(0,0,0, 0.5)';
    ctx.fillStyle = 'darkgray';
    ctx.stroke(landingPlatform);
    ctx.fill(landingPlatform);

    ctx.resetTransform();
    if (ctx.isPointInPath(landingPlatform, model.x - model.legsLength, platform.y) && ctx.isPointInPath(landingPlatform, model.x + model.width + model.legsLength, platform.y)) {
        ctx.fillStyle = 'limegreen';
    } else {
        model.y + model.height < canvasH - 200 ? ctx.fillStyle = 'orange' : ctx.fillStyle = 'red';
    }
    scalingPercentage !== 0 ? ctx.scale(scalingPercentage, scalingPercentage) : undefined;

    ctx.fillRect(platform.x, platform.y, 10, platform.height);
    ctx.fillRect(platform.x + platform.width - 10, platform.y, 10, platform.height);
    ctx.strokeRect(platform.x, platform.y, 10, platform.height);
    ctx.strokeRect(platform.x + platform.width - 10, platform.y, 10, platform.height);

    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${this.height}px sans-serif`;
    ctx.font = 'bold 15px sans-serif';
    ctx.fillText('X', this.x + this.width/2, this.y + this.height/2 + 1);

    if (game.scenario === 'ocean' && game.graphics === 'high') {

        var platformShip = new Path2D();
        platformShip.moveTo(this.x + this.width, this.y + this.height/2);
        platformShip.lineTo(this.x + this.width + 15, this.y + this.height/2);
        platformShip.lineTo(this.x + this.width, this.y + this.height + 5);
        platformShip.lineTo(this.x, this.y + this.height + 5);
        platformShip.lineTo(this.x + this.width, this.y + this.height/2);

        ctx.strokeStyle = 'rgba(0,0,0, 0.5)';
        ctx.fillStyle = 'darkgray';
        ctx.fill(platformShip);
        ctx.stroke(platformShip);
    }

    game.level === 1 ? scenario('ground') : undefined;
    game.level === 2 ? scenario('ground') : undefined;
    game.level === 3 ? scenario('ocean') : undefined;
    game.level === 4 ? scenario('ocean') : undefined;

    if (game.scenario !== 'ocean') {
        ctx.fillRect(this.x - 25, canvasH - 70, 3, 65);
        ctx.fillRect(this.x - 15, canvasH - 50, 3, 40);
        ctx.fillRect(this.x + this.width + 15, canvasH - 50, 3, 40);
        ctx.fillRect(this.x + this.width + 25, canvasH - 70, 3, 65);
    }

    ctx.restore();
};

// Engines object with methods for drawing each engine
var engines = {
    status: 'off',
    sideEnginesWidth: 20,
    sideEnginesHeight: 5,
    mainEngineWidth: model.width/5*3,
    mainEngineHeight: 50,
    drawLeft: function() {

        var lEngineGrad = ctx.createLinearGradient(model.x - 15, model.y + model.height + 15, model.x + model.width/10, model.y + model.height - 5);

        lEngineGrad.addColorStop(0,'rgba(166,182,255, 0.5)');
        lEngineGrad.addColorStop(0.5,'rgba(255,255,128, 0.8)');
        lEngineGrad.addColorStop(1,'rgba(255,255,255, 0.8)');

        ctx.fillStyle = lEngineGrad;

        lEngineExhaust = new Path2D();
        lEngineExhaust.moveTo(model.x, model.y + model.height - 5);
        lEngineExhaust.quadraticCurveTo(model.x - 5, model.y + model.height + 2, model.x - 15, model.y + model.height + 15);
        lEngineExhaust.quadraticCurveTo(model.x, model.y + model.height, model.x + model.width/5, model.y + model.height - 5);
        lEngineExhaust.lineTo(model.x, model.y + model.height - 5);
        ctx.fill(lEngineExhaust);
    },

    drawRight: function() {

        var rEngineGrad = ctx.createLinearGradient(model.x + model.width/10*9, model.y + model.height - 5, model.x + model.width + 15, model.y + model.height + 15);

        rEngineGrad.addColorStop(0,'rgba(255,255,255, 0.8)');
        rEngineGrad.addColorStop(0.5,'rgba(255,255,128, 0.8)');
        rEngineGrad.addColorStop(1,'rgba(166,182,255, 0.5)');

        ctx.fillStyle = rEngineGrad;

        rEngineExhaust = new Path2D();
        rEngineExhaust.moveTo(model.x + model.width, model.y + model.height - 5);
        rEngineExhaust.quadraticCurveTo(model.x + model.width + 5, model.y + model.height + 2, model.x + model.width + 15, model.y + model.height + 15);
        rEngineExhaust.quadraticCurveTo(model.x + model.width, model.y + model.height, model.x + model.width/5*4, model.y + model.height - 5);
        rEngineExhaust.lineTo(model.x + model.width/10*9, model.y + model.height - 5);
        ctx.fill(rEngineExhaust);
    },

    drawMain: function() {

        this.status = 'on';

        ctx.save();
        ctx.translate(model.x, model.y + model.height);
        ctx.rotate(Math.PI/180 * model.inclination);

        var mainEngineGrad = ctx.createLinearGradient(model.width/2, 0, model.width/2, model.height);

        mainEngineGrad.addColorStop(0,'rgba(255,255,255, 0.8)');
        mainEngineGrad.addColorStop(0.5,'rgba(255,255,128, 0.8)');
        mainEngineGrad.addColorStop(1,'rgba(166,182,255, 0.5)');

        ctx.fillStyle = mainEngineGrad;

        var fireTail = function(val) {

            var boosterExhaust = model.height + val;
            var boosterBase = model.y + model.height + val;
            var tail = boosterExhaust;

            if (model.x >= platform.x && model.x + model.width <= platform.x + platform.width && boosterBase + model.height >= platform.y) {
                tail = platform.y - model.y - model.height;
            }

            return tail;
        };

        mainEngineExhaust = new Path2D();
        mainEngineExhaust.moveTo(model.width/5, -5)
        mainEngineExhaust.quadraticCurveTo(0, fireTail(5), model.width/2, fireTail(0));
        mainEngineExhaust.quadraticCurveTo(model.width, fireTail(5), model.width/5*4, -5);
        mainEngineExhaust.lineTo(model.width/5*4, -5);
        mainEngineExhaust.closePath();
        ctx.fill(mainEngineExhaust);

        ctx.resetTransform();
        ctx.restore();
    },
    ignite: function(configuration) {

        let conf = configuration.toLowerCase();

        const SIDE_ENGINE_FUEL_RATE = 250;
        const MAIN_ENGINE_FUEL_RATE = 500;
        const FULL_ENGINE_FUEL_RATE = 1000;
    
        switch(conf) {
            case 'left':

                this.drawRight();

                model.vx -= 0.5;
                model.vy += -model.vy / 80;
                model.fuel -= SIDE_ENGINE_FUEL_RATE;
                model.inclination < model.inclinationLimit ? model.inclination += 0.5 : undefined;
            break;
            case 'right':

                this.drawLeft();

                model.vx += 0.5;
                model.vy += -model.vy / 80;
                model.fuel -= SIDE_ENGINE_FUEL_RATE;
                model.inclination > -model.inclinationLimit ? model.inclination -= 0.5 : undefined;
            break;
            case 'vertical':

                this.drawMain();

                model.vy += -model.vy / 40;
                model.fuel -= MAIN_ENGINE_FUEL_RATE;
                model.inclination < 0 ? model.inclination += 0.5 : model.inclination > 0 ? model.inclination -= 0.5 : undefined;
            break;
            case 'full thrust':

                this.drawLeft();
                this.drawMain();
                this.drawRight();

                model.vy += -model.vy / 20;
                model.vx += -model.vx / 100;
                model.fuel -= FULL_ENGINE_FUEL_RATE;
                model.inclination < 0 ? model.inclination += 0.5 : model.inclination > 0 ? model.inclination -= 0.5 : undefined;
            break;
        }
    }
}

// Draws gameplay buttons
function drawGameplayButtons() {

    ctx.save();

    var gamePlayBtnCoordX = 50;
    platform.x + platform.width/2 < canvasW/2 ? gamePlayBtnCoordX = canvasW - gamePlayBtnCoordX : undefined;

    ctx.fillStyle = 'rgba(0,0,0, 0.5)';
    ctx.strokeStyle = 'lightgray';
    ctx.strokeWidth = 1;

    ctx.font = '40px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    exitGameBtn = new Path2D();
    exitGameBtn.arc(gamePlayBtnCoordX, canvasH-50, 35, 0, Math.PI*2);

    ctx.fill(exitGameBtn);
    ctx.stroke(exitGameBtn);

    if (game.status !== 'over' && game.status !== 'paused') {

        resumePauseGameBtn = new Path2D();
        resumePauseGameBtn.arc(gamePlayBtnCoordX, canvasH-135, 35, 0, Math.PI*2);

        ctx.fill(resumePauseGameBtn);
        ctx.stroke(resumePauseGameBtn);

        ctx.fillStyle = 'rgba(0,255,255, 0.75)';
        ctx.fillText('ll', gamePlayBtnCoordX, canvasH-130);
        ctx.strokeText('ll', gamePlayBtnCoordX, canvasH-130);
    }

    ctx.fillStyle = 'rgba(255,0,0, 0.75)';
    ctx.fillText('x', gamePlayBtnCoordX, canvasH-50);
    ctx.strokeStyle = 'orangered';
    ctx.strokeText('x', gamePlayBtnCoordX, canvasH-50);

    ctx.restore();
}

// Clear the Canvas
function clearCanvas() {
    ctx.clearRect(0, 0, canvasW, canvasH);
}

// Turns gravity on
var physicsInterval;
function physics(g = 9.80665) {

    game.gravity = g;

    physicsInterval = setInterval(function() {

        ctx.resetTransform();

        if (Math.abs(model.vx*60) < 17.5) {
            model.inclination < 0 ? model.inclination += 0.0625 : undefined;
            model.inclination > 0 ? model.inclination -= 0.0625 : undefined;
        }

        model.vx = (Math.sign(model.vx) * Math.abs(model.vx)) * 0.98;
        Math.abs(model.vx) > 0.001 ? model.x += model.vx : model.vx = 0;

        getDeviceOS() === 'windows' ? model.vy += g/fps : model.vy += g/fps/60;

        model.y += model.vy;

        if (game.sky === 'night') {
            if (Math.abs(meteor.y - model.y) < model.height - 5 && Math.abs(meteor.x - model.x) < model.width) {
                model.status = 'crashed';
            };
        }


        if (model.y + model.height >= canvasH || ctx.isPointInPath(landingPlatform, model.x + model.width/2, model.y + model.height)) {
            if (Math.abs(model.vy) > 0.2) {
                
                model.status = 'crashed';
            } else {
                
                if (model.x - model.legsLength >= platform.x && model.x + model.width + model.legsLength <= platform.x + platform.width && model.y + model.height >= platform.y) {
                    
                    if (model.name === 'booster') {
                        model.legsRotation === 1 ? model.status = 'landed' : model.status = 'crashed';
                    } else if (model.name === 'spaceship') {
                        gameModel.legsExtension === 5 ? model.status = 'landed' : model.status = 'crashed';
                    }
                } else {
                    model.status = 'missed target';
                }
            }
        }

        if (model.y >= canvasH - model.height || model.y + model.vy < 0 || ctx.isPointInPath(landingPlatform, model.x + model.width/2, model.y + model.height)) {
            model.vy = -model.vy;
            model.vy /= 2;
        }
        if (model.x + model.vx > canvasW - model.width || model.x + model.vx < 0) {
            model.vx = -model.vx;
        }

        scalingPercentage !== 0 ? ctx.scale(scalingPercentage, scalingPercentage) : undefined;

        if (model.status === 'landed' || model.status === 'missed target' || model.status === 'crashed' || game.status === 'over' || game.status === 'reset') {
                clearInterval(physicsInterval.valueOf());
        }

        model.status !== 'reset' ? model.draw() : undefined;
        game.status != 'over' && model.status.match(/re-entry|crashed/) && game.sky === 'night' ? meteor.draw() : undefined;

        model.x < 0 ? model.x = 0 : undefined;
        model.x + model.width > canvasW ? model.x = canvasW - model.width : undefined;

    }, 1000/fps);
}

// shows game statistic
function stats() {

    ctx.save();
    ctx.font = '20px sans-serif';
    ctx.textAlign = 'start';
    ctx.fillStyle = 'rgba(0,0,0, 0.75)';
    ctx.fillRect(0, 0, canvasW, 35);
    ctx.fillStyle = 'white';
    if (game.sky !== 'day') {
        ctx.strokeStyle = 'rgba(255,255,255, 0.5)';
        ctx.lineWidth = 0.5;
        ctx.beginPath();
        ctx.moveTo(0,35);
        ctx.lineTo(canvasW, 35);
        ctx.closePath();
        ctx.stroke();
    }

    ctx.fillText(`${text.altitude} = ${Math.round(Math.abs(canvasH - model.y - model.height))} ${text.meters}`, 5, 25);
    ctx.fillText(`${text.gravity} = ${game.gravity} m/s²`, canvasW/5, 25, 175);
    ctx.fillText(`Vx = ${(model.vx*60).toFixed(3)} m/s`, canvasW/5*2 + 5, 25);
    ctx.fillText(`Vy = ${(model.vy * 60).toFixed(3)} m/s`, canvasW/5*3 + 5, 25);
    ctx.fillText(`${text.time} = ${cronometer.elapsed}`, canvasW/5*4 + 5, 25);
    //ctx.fillText(`Momentum Y = ${(model.mass * model.vy).toFixed(3)} Kg*m/s`, 5, 55);
    game.sky === 'day' ? ctx.fillStyle = 'black' : ctx.fillStyle = 'white';
    var finalLevelText = '';
    game.level === game.levels ? finalLevelText = ` (${text.finalLevel})` : undefined;
    ctx.fillText(`${text.level} ${game.level} ${finalLevelText}`, 5, 60);
    ctx.textAlign = 'end';
    ctx.fillText(text.fuel, canvasW - 15, 55);


    var fuelPercentage = (model.fuel * 100 / model.fuelCapacity).toPrecision(3);

    if (model.fuel > 0) {
        ctx.fillText(`${fuelPercentage} %`, canvasW - 10, 250);
    }

    ctx.textAlign = 'start';
    ctx.fillStyle = 'black';
    ctx.strokeStyle = 'dimgray';
    ctx.fillRect(canvasW - 51, 61.5 ,27, 164.6);
    ctx.strokeRect(canvasW - 51, 61.5 ,27, 164.6);

    var fuelGrad = ctx.createLinearGradient(canvasW - 12.5, 61, canvasW - 12.5, 162.6);
    fuelGrad.addColorStop(0, 'yellow');
    fuelGrad.addColorStop(0.5, 'orange');
    fuelGrad.addColorStop(1, 'red');

    ctx.fillStyle = fuelGrad;

    var fuelBarAspectRatio = 164.6/100;
    
    ctx.fillRect(canvasW -50, 225 - fuelPercentage*fuelBarAspectRatio, 25, fuelPercentage*fuelBarAspectRatio);

    if (model.fuel <= 0) {
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(text.zero, canvasW - 37.5, 220);
    }

    game.sky === 'day' ? ctx.fillStyle = 'rgba(0,0,0, 0.5)' : ctx.fillStyle = 'rgba(255,255,255, 0.075)';
    ctx.fillRect(815, 65, 150, 75);
    game.sky !== 'day' ? (ctx.lineWidth = 0.5, ctx.strokeRect(815, 65, 150, 75)) : undefined;
    ctx.fillStyle = 'rgba(0,0,0, 0.5)';
    ctx.fillRect(815, 65, 150, 25);
    ctx.fillStyle = 'white';
    ctx.textAlign = 'end';
    ctx.fillText(`${model.fuel} ${text.litres}`, 950, 85);
    Math.abs(model.vx) > 0.1 ? (ctx.fillStyle = 'yellow', ctx.fillText(text.unstable, 950, 110)) : (ctx.fillStyle = 'white', ctx.fillText(text.stable, 950, 110));
    Math.abs(model.vy) > 0.2 || model.status === 'crashed'? (ctx.fillStyle = 'red', ctx.fillText(text.decelerate, 950, 135)) : (ctx.fillStyle = 'limegreen', ctx.fillText(text.goodSpeed, 950, 135, 125));

    ctx.textAlign = 'start';

    if (model.y + model.height >= canvasH - 200) {

        ctx.fillRect(815, 150, 150, 35);
        ctx.strokeStyle = 'black';
        ctx.strokeRect(815, 150, 150, 35);
        ctx.fillStyle = 'white';

        if (model.y + model.height >= canvasH || ctx.isPointInPath(landingPlatform, model.x + model.width/2, model.y + model.height)) {
            var landingStatus = function() {
                if (Math.abs(model.vy) > 0.2) {
                    return text.impact;
                } else {
                    return text.contact;
                }
            };
            ctx.fillText(landingStatus(), 825, 175);
        } else if (model.y + model.height >= canvasH - 100) {
            ctx.fillText(text.imminentContact, 825, 175, 135);
        } else {
            ctx.fillText(text.proximityWarning, 825, 175, 135);
        }

        if (model.y + model.height >= canvasH - 100) {
            var legsState;
            if (gameModel.name === 'booster') {
                model.legsRotation > 1 ? legsState = text.deployLegs : legsState = text.legsDeployed;
            } else if (gameModel.name === 'spaceship') {
                gameModel.legsExtension < 5 ? legsState = text.deployLegs : legsState = text.legsDeployed;
            }
            ctx.fillText(legsState, 825, 225, 135);
        }
    }

    if (model.fuel <= 0 || fuelPercentage <= 25) {
        var fuelWarningY, fuelTextWarningY;
        var fuelWarning = function() {
            if (model.fuel <= 0) {
                return text.noFuel;
            } else {
                return text.lowFuel;
            }
        };

        model.y + model.height >= canvasH - 200 ? (fuelWarningY = 195, fuelTextWarningY = 220)
            : (fuelWarningY = 150, fuelTextWarningY = 175);

        model.fuel === 0 ? ctx.fillStyle = 'red' : ctx.fillStyle = 'orange';
        ctx.strokeStyle = 'black';
        ctx.fillRect(815, fuelWarningY, 150, 35);
        ctx.strokeRect(815, fuelWarningY, 150, 35);
        ctx.fillStyle = 'white';
        ctx.fillText(fuelWarning(), 825, fuelTextWarningY, 135);
    }

    game.sky === 'day' ? ctx.fillStyle = 'rgba(0,0,0, 0.7)' : ctx.fillStyle = 'rgba(255,255,255, 0.7)';
    if (model.x < platform.x) {
        Math.sign(model.vx) === -1 ? ctx.fillText(text.adjustCourse, 650, 87.5, 150) : undefined;
    } else if (model.x > platform.x + platform.width) {
        Math.sign(model.vx) === 1 ? ctx.fillText(text.adjustCourse, 650, 87.5, 150) : undefined;
    }
    ctx.restore();
}

// Displays a welcome screen for the game
function displayGameMenu() {

    setLanguage();

    menu.active = true;
    menu.current = 'welcome';
    
    volumeSlider.value = game.volume * 100;
    volumeSliderText.innerText = `${Math.floor(game.volume * 100)}%`;
    
    toggleExitButton();

    cronometer.cronometerCount !== undefined ? cronometer.stop() : undefined;

    document.removeEventListener('keydown', gameplayInput);
    document.removeEventListener('keypress', gameplayInput);
    document.removeEventListener('keyup', gameplayInput);

    canvas.removeEventListener('pointermove', gameplayInput);
    canvas.removeEventListener('click', gameplayInput);

    canvas.removeEventListener('click', gameOverInput);

    canvas.removeEventListener('click', game.resume);

    clearInterval(loadingScreenInterval);

    stopAudio(sounds.explosion);
    stopAudio(sounds.engines);
    stopAudio(sounds.water);

    clearCanvas();

    ctx.save();

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvasW, canvasH);
    
    ctx.fillStyle = 'white';
    ctx.textAlign = 'start';
    ctx.textBaseline = 'middle';
    ctx.font = '60px sans-serif';

    ctx.fillStyle = 'darkred';
    ctx.strokeStyle = 'red';
    ctx.fillRect(canvasW/20*11 - 3, canvasH/8 - 1, canvasW - canvasW/20*11 + 3, 60);
    ctx.strokeRect(canvasW/20*11 - 3, canvasH/8 - 1, canvasW - canvasW/20*11 + 3, 60);

    ctx.fillStyle = 'white';
    ctx.fillText('Booster Lander', canvasW/20*11, canvasH/5.95);
    ctx.font = '50px sans-serif';
    ctx.fillStyle = 'lawngreen';
    ctx.fillText(text.start, canvasW/10*6, canvasH/7*2);
    ctx.fillStyle = 'darkgray';
    ctx.fillText(text.instructions, canvasW/10*6, canvasH/7*3);
    ctx.fillText(text.language, canvasW/10*6, canvasH/7*4);
    ctx.fillText(text.controls, canvasW/10*6, canvasH/7*5);
    ctx.fillText(text.settings, canvasW/10*6, canvasH/7*6);

    startGameBtn = new Path2D();
    menuControlsBtn = new Path2D();
    menuInstructionsBtn = new Path2D();
    menuLangBtn = new Path2D();
    menuSettingsBtn = new Path2D();

    ctx.strokeStyle = 'white';

    startGameBtn.rect(canvasW/10*6 - 1, canvasH/7*2 - 1, ctx.measureText(text.start).width, 50);

    menuInstructionsBtn.rect(canvasW/10*6 - 1, canvasH/7*3 - 1, ctx.measureText(text.instructions).width, 50);

    menuLangBtn.rect(canvasW/10*6 - 1, canvasH/7*4 - 1, ctx.measureText(text.language).width, 50);

    menuControlsBtn.rect(canvasW/10*6 - 1, canvasH/7*5 - 1, ctx.measureText(text.controls).width, 50);

    menuSettingsBtn.rect(canvasW/10*6 - 1, canvasH/7*6 - 1, ctx.measureText(text.settings).width, 50);

    ctx.font = '15px sans-serif';
    ctx.fillStyle = 'gray';
    ctx.textAlign = 'end';
    ctx.fillText('Booster Lander - Copyright © 2020 Juan Astudillo', canvasW - 15, canvasH/20*19.25);

    ctx.restore();

    drawRocket();

    canvas.removeEventListener('click', menuInput);
    document.removeEventListener('keydown', menuInput);

    canvas.addEventListener('click', menuInput);
    document.addEventListener('keydown', menuInput);

    recolorCanvasContainer();

    game.level = 1;
    game.sky = 'day';
    game.scenario = 'ground';

    pauseButton.innerText = text.start;
    exitButton.innerText = text.back;
}

var soundTimeout;
// Captures mouse and/or keyboard input
function gameplayInput(e) {

    if (game.status === 'started') {

        var reEntryBoosterThrust = EARTH_GRAVITY/fps;

        if (e.type.includes('key')) {
            e.code === 'Space' || e.code.includes('Arrow', 0) ? e.preventDefault() : undefined;
        }

        if (game.status === 'started' && model.status != 'crashed') {
            if (model.fuel > 0) {
                if (e.type.includes('key')) {
                    if (e.code.match(/KeyW|ArrowUp/)) {

                        engines.ignite('vertical');
                    }

                    if (e.code === 'KeyL' || e.code === 'Space') {

                        engines.ignite('full thrust');
                    }

                    if (e.code.match(/KeyA|ArrowLeft/)) {

                        engines.ignite('left');
                    }
                    if (e.code.match(/KeyD|ArrowRight/)) {
                        
                        engines.ignite('right');
                    }
                }

                if (Math.sign(e.movementX) === -1) {

                    engines.ignite('left');
                }
                if (Math.sign(e.movementX) === 1) {
                    
                    engines.ignite('right');
                }

                if (e.movementY < -5) {
                    engines.drawLeft();
                    engines.drawMain();
                    engines.drawRight();

                    getDeviceOS().match(/win|linux|mac/ig) ? model.vy += -model.vy / 10 : model.vy = 0;
                    model.vx += -model.vx / 100;
                    model.fuel -= 1000;
                    model.inclination < 0 ? model.inclination += 0.5 : model.inclination > 0 ? model.inclination -= 0.5 : undefined;

                } else if (e.movementY < 0) {
                    engines.drawMain();
                    getDeviceOS().match(/win|linux|mac/ig) ? model.vy += -model.vy / 20 : model.vy += -model.vy / 4;
                    model.fuel -= 500;
                }

                if (e.code && e.code.match(/Key[AWDL]+|Arrow(Left|Up|Right)|Space/ig)) {
                    e.type !== 'keyup' ? sounds.engines.play() : stopAudio(sounds.engines);
                }

                if (e.type === 'pointermove') {
                    clearTimeout(soundTimeout);
                    e.movementY <= 0 ? sounds.engines.play() : undefined;

                    soundTimeout = setTimeout(function() {
                        sounds.engines.pause();
                    }, 300);

                }

            } else {
                model.fuel = 0;
                stopAudio(sounds.engines);
            }

            if (e.code === 'KeyP' || e.code === 'Enter') {
                e.type === 'keydown' ? game.pause() : undefined;
            }
        }
    } else if (game.status === 'paused') {
        if (e.code === 'KeyP' || e.code === 'Enter' || e.code === 'Backspace') {
            e.type === 'keydown' ? game.resume() : undefined;
        }
    }

    if (e.code === 'Escape') {
        game.reset();
    }

    if (e.type === 'click') {
        if (ctx.isPointInPath(exitGameBtn, e.offsetX, e.offsetY)) {
            sounds.switch.play();
            game.reset();
        }

        if (game.status != 'paused' && ctx.isPointInPath(resumePauseGameBtn, e.offsetX, e.offsetY)) {
            sounds.menuBlip.play();
            game.status === 'started' ? game.pause() : undefined;
        }
    }
    
}

function menuInput(e) {

    var eX = e.offsetX, eY = e.offsetY;

    if (game.status === 'started' || game.status === 'reset') {
        if (menu.current === 'welcome' || menu.current === 'instructions') {
            if (ctx.isPointInPath(menuControlsBtn, eX, eY)) {
                sounds.menuBlip.play();
                menu.controls();
            }
        }

        if (game.status === 'reset' && menu.current != 'welcome') {
            if (ctx.isPointInPath(menuBackgroundTouchArea, eX, eY)) {
                sounds.switch.play();
                displayGameMenu();
            }
        }

        if (menu.current === 'welcome') {
            if (ctx.isPointInPath(startGameBtn, eX, eY)) {

                sounds.menuStart.play();

                game.start();
                canvas.removeEventListener('click', menuInput);
                document.removeEventListener('keydown', menuInput);
            }

            if (ctx.isPointInPath(menuInstructionsBtn, eX, eY)) {
                sounds.menuBlip.play();
                menu.instructions();
            }

            if (ctx.isPointInPath(menuLangBtn, eX, eY)) {
                sounds.menuBlip.play();
                menu.language();
            }

            if (ctx.isPointInPath(menuSettingsBtn, eX, eY)) {
                sounds.menuBlip.play();
                menu.settings();
            }
        }
    }

    if (menu.current === 'language') {
        if (ctx.isPointInPath(langSelectorBtn, eX, eY) || ctx.isPointInPath(menuLangRightArrow, eX, eY)) {
            
            sounds.menuBlip.play();
            game.langInt < game.langArray.length - 1 ? game.langInt++ : game.langInt = 0;

        } else if (ctx.isPointInPath(menuLangLeftArrow, eX, eY)) {
            sounds.menuBlip.play();
            game.langInt > 0 ? game.langInt-- : game.langInt = game.langArray.length - 1;
        }

        ctx.isPointInPath(spanishLangBtn, eX, eY) ? (game.langInt = game.langArray.indexOf('es'), sounds.menuBlip.play()) : undefined;
        ctx.isPointInPath(englishLangBtn, eX, eY) ? (game.langInt = game.langArray.indexOf('en'), sounds.menuBlip.play()) : undefined;
        ctx.isPointInPath(germanLangBtn, eX, eY) ? (game.langInt = game.langArray.indexOf('de'), sounds.menuBlip.play()) : undefined;
        ctx.isPointInPath(japaneseLangBtn, eX, eY) ? (game.langInt = game.langArray.indexOf('ja'), sounds.menuBlip.play()) : undefined;

        game.language = game.langArray[game.langInt];
        menu.language();
    }

    if (menu.current === 'settings') {
        if (ctx.isPointInPath(spacecraftSelectorBtn, eX, eY) || ctx.isPointInPath(menuModelRightArrow, eX, eY) || ctx.isPointInPath(menuModelLeftArrow, eX, eY)) {
           
            gameModel === booster ? model.update(spaceShip) : model.update(booster);  
        }

        if (ctx.isPointInPath(volumeBtn.bar, eX, eY)) {
           if (scalingPercentage < 1) {
                volumeBtn.width = Math.abs(638 - eX/scalingPercentage);
           } else {
                volumeBtn.width = Math.abs(638 - eX);
           }
        }

        if (ctx.isPointInPath(volumeMuteBtn, eX, eY)) {
            game.volume = 0;
            volumeBtn.width = 0;
        }

        if (ctx.isPointInPath(volumeMaxBtn, eX, eY)) {
            game.volume = 1;
            volumeBtn.width = volumeBtn.maxWidth;
        }

        sounds.menuBlip.play();
        menu.settings();
    }

    if (e.code === 'Escape' || e.code === 'Backspace') {

        sounds.switch.play();

        canvas.removeEventListener('click', menuInput);
        document.removeEventListener('keydown', menuInput);
        game.reset();
    }
}

function gameOverInput(e) {

    if (ctx.isPointInPath(exitGameBtn, e.offsetX, e.offsetY)) {
        sounds.switch.play();
        game.reset();
    } else {
        game.start();
    }
}

// Draws rocket background for the welcome screen, needs polishing
function drawRocket() {

    ctx.save();
    ctx.scale(canvasH/1200, canvasH/1200);

    var skyGradient = ctx.createLinearGradient(400, 0, 400, 1200);
    skyGradient.addColorStop(0, 'deepskyblue');
    skyGradient.addColorStop(1, 'lightskyblue');

    var sky = skyGradient;

    var rocketGradient = ctx.createLinearGradient(350, 1200/2, 450, 1200/2);
    rocketGradient.addColorStop(0, 'white');
    rocketGradient.addColorStop(1, 'lightgray');

    var rocketDarkGradient = ctx.createLinearGradient(350, 1200/2, 450, 1200/2);
    rocketDarkGradient.addColorStop(0, '#303030');
    rocketDarkGradient.addColorStop(1, 'black');

    var sunCrown = ctx.createRadialGradient(100, 100, 12.5, 100, 100, 50);
    sunCrown.addColorStop(0, '#FFFFCC');
    sunCrown.addColorStop(1, 'rgba(255,255,255, 0)');

    var sun = new Path2D();

    var rocketPayload = new Path2D();
    var rocketFirstStage = new Path2D();
    var rocketBase = new Path2D();

    var thruster1 = new Path2D();
    var thrusters2 = new Path2D();
    var thrusters3 = new Path2D();

    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, 800, 1200);
    sun.arc(100, 100, 75, 0, Math.PI * 2);
    ctx.fillStyle = sunCrown;
    ctx.fill(sun);
    ctx.fillStyle = 'rgb(0,75,0, 0.5)';
    ctx.beginPath();
    ctx.moveTo(0, 1200 - 50);
    ctx.bezierCurveTo(170, 1025, 250, 1150, 350, 1150);
    ctx.quadraticCurveTo(350,1150,400,1150);
    ctx.quadraticCurveTo(500,1100,700,1175);
    ctx.lineTo(0,1200 - 25);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = 'rgb(0,75,0)';
    ctx.fillRect(0, 1200 - 25, 800, 25)

    ctx.strokeStyle = 'rgb(0,0,0, 0.8)';

    rocketPayload.moveTo(430, 75);
    rocketPayload.quadraticCurveTo(400, 10, 370, 75);
    rocketPayload.lineTo(357.5, 100);
    rocketPayload.lineTo(442.5, 100);
    rocketPayload.lineTo(357.5, 100);
    rocketPayload.lineTo(357.5, 230);
    rocketPayload.lineTo(442.5, 230);
    rocketPayload.moveTo(357.5, 230);
    rocketPayload.lineTo(370, 250);
    rocketPayload.lineTo(430, 250);
    rocketPayload.lineTo(442.5, 230);
    rocketPayload.lineTo(442.5, 100);
    rocketPayload.lineTo(430, 75);
    ctx.fillStyle = rocketGradient;
    ctx.fill(rocketPayload);
    ctx.stroke(rocketPayload);
    rocketFirstStage.rect(370, 250, 60, 700);
    ctx.fillStyle = rocketGradient;
    ctx.fill(rocketFirstStage);
    ctx.stroke(rocketFirstStage);

    ctx.fillStyle = rocketDarkGradient;
    ctx.fillRect(370, 450, 60, 300);
    ctx.strokeRect(370, 450, 60, 300);

    rocketBase.moveTo(370, 950);
    rocketBase.lineTo(362, 1000);
    rocketBase.lineTo(362, 1125);
    rocketBase.lineTo(370, 1150);
    rocketBase.lineTo(430, 1150);
    rocketBase.lineTo(438, 1125);
    rocketBase.lineTo(438, 1000);
    rocketBase.lineTo(430, 950);
    ctx.fillStyle = rocketDarkGradient;
    ctx.fill(rocketBase);
    ctx.stroke(rocketBase);

    ctx.fillStyle = 'gray';
    ctx.strokeStyle = '#505050';
    thrusters3.arc(377.5, 1156.25, 6.25, 0, Math.PI, true);
    thrusters3.arc(423.5, 1156.25, 6.25, 0, Math.PI, true);
    ctx.fill(thrusters3);
    ctx.stroke(thrusters3);
    thrusters2.arc(388.25, 1156.25, 6.25, 0, Math.PI, true);
    thrusters2.arc(412.25, 1156.25, 6.25, 0, Math.PI, true);
    ctx.fill(thrusters2);
    ctx.stroke(thrusters2);
    thruster1.arc(400, 1156.25, 6.25, 0, Math.PI, true);
    ctx.fill(thruster1);
    ctx.stroke(thruster1);

    ctx.fillStyle = 'gray';
    ctx.strokeStyle = 'black';
    ctx.fillRect(225, 75, 50, 1106.25);
    ctx.strokeRect(225, 75, 50, 1106.25);
    ctx.fillStyle = 'darkgray';
    ctx.fillRect(225, 475, 275, 25);
    ctx.strokeRect(225, 475, 275, 25);
    ctx.fillRect(225, 1156.25, 325, 35);
    ctx.strokeRect(225, 1156.25, 325, 35);

    ctx.restore();
};

var scenarioInterval;
var my = 0, myprev = 1, wy = canvasH - 20;
function scenario(environment = 'ground') {

    game.scenario = environment;

    ctx.save();

    switch(environment) {
        case 'ground':
            platform.y = canvasH - 15;
        break;
        case 'ocean':
            my === 0 ? (my += 0.25, myprev = my-1) : undefined;
            my === 5 ? (my -= 0.25, myprev = my+1) : undefined;
            my < 5 && my < myprev ? (my -= 0.25, myprev = my+1) : undefined;
            my > 0 && my > myprev ? (my += 0.25, myprev = my-1) : undefined;

            platform.y = wy - my - platform.height/2;

            if (platform.x <= 0 || platform.x >= canvasW - platform.width) {
                platform.vx *= -1;
            }

            platform.x += platform.vx;

            // Waves
            ctx.fillStyle = 'rgba(0,0,206, 0.5)';
            ctx.beginPath();
            ctx.moveTo(0,wy);

            for(var i = 0; i <= 10; i++) {
                ctx.bezierCurveTo(i*canvasW/10-canvasW/40, wy-my, i*canvasW/10-canvasW/40*2, wy+my, i*canvasW/10, wy);
            }

            ctx.lineTo(canvasW, canvasH);
            ctx.lineTo(0, canvasH);
            ctx.closePath();
            ctx.fill();

        break;
    }
    ctx.restore();
}

function setLevelBackground(time = 'day') {

    // Sky background gradient
    var skyGrad = ctx.createLinearGradient(canvasW/2, 0, canvasW/2, canvasH);
    skyGrad.addColorStop(0,'deepskyblue');
    skyGrad.addColorStop(1,'lightskyblue');

    if (time === 'day') {
        game.sky = 'day';
        ctx.fillStyle = skyGrad;
    } else {
        if (game.graphics === 'low') {
            ctx.fillStyle = 'navy';
        } else {
            ctx.drawImage(starsCanvas, 0, 0);
           
            if (game.environment !== 'space') {
                ctx.fillStyle = 'rgba(0,0,255,0.1775)';
                ctx.fillRect(0,0, canvasW, canvasH);
            }
            ctx.fillStyle = 'black';
        }
    }

    time === 'day' || game.graphics === 'low' ? ctx.fillRect(0,0, canvasW, canvasH) : undefined;

    // Background
    if (game.scenario === 'ground') {
        time === 'day' ? ctx.fillStyle = '#3f8b7c' : ctx.fillStyle = 'rgb(0,25,0)';
        ctx.beginPath();
        ctx.moveTo(0, canvasH - 25);
        ctx.bezierCurveTo(canvasW/4*1.5, canvasH/1.5, canvasW/3, canvasH + 80, canvasW, canvasH/10*9);
        ctx.lineTo(canvasW, canvasH);
        ctx.lineTo(0, canvasH);
        ctx.closePath();
        ctx.fill();

        ctx.fillStyle = 'darkgreen';
        ctx.fillRect(0, canvasH - 10, canvasW, 10);
    }

    if (time === 'night') {
        game.sky = 'night';
        ctx.fillStyle = 'rgba(0,0,0, 0.5)';
        ctx.fillRect(0,0, canvasW, canvasH);
    }

    var sunMoonOrb = {
        x: 100,
        y: 100,
        r: 30,
    };

    time === 'day' ? (sunMoonOrb.x = 100, sunMoonOrb.y = 100) :  (sunMoonOrb.x = canvasW/2, sunMoonOrb.y = 150);

    // Sun gradient
    var sunGrad = ctx.createRadialGradient(sunMoonOrb.x, sunMoonOrb.y, 5, sunMoonOrb.x, sunMoonOrb.y, 25);
    sunGrad.addColorStop(0, '#FFFFA1');
    sunGrad.addColorStop(1, 'rgba(255,255,255, 0)');

    // Moon gradient
    var moonGrad = ctx.createRadialGradient(sunMoonOrb.x, sunMoonOrb.y, 5, sunMoonOrb.x, sunMoonOrb.y, 25);
    moonGrad.addColorStop(0, 'white');
    moonGrad.addColorStop(0.5, 'white');
    moonGrad.addColorStop(1, 'rgba(0,0,0, 0)');

    ctx.arc(sunMoonOrb.x, sunMoonOrb.y, sunMoonOrb.r, 1, Math.PI*2);
    time === 'day' ? ctx.fillStyle = sunGrad : ctx.fillStyle = moonGrad;
    ctx.fill();
}

pauseButton.onclick = function() {

    switch(game.status) {
        case 'reset':
            game.start();
            pauseButton.innerText = text.pause;
        break;
        case 'started':
            game.pause();
            pauseButton.innerText = text.resume;
        break;
        case 'paused':
            game.resume();
            pauseButton.innerText = text.pause;
        break;
        case 'over':
            game.start();
            pauseButton.innerText = text.pause;
        break;
    }
};

exitButton.onclick = () => {
    sounds.switch.play(); 
    menu.active === false ? game.reset() : displayGameMenu(); 
};

volumeSlider.addEventListener('input', ()=>{menu.changeVolume(volumeSlider.value)})

function toggleExitButton() {
    game.status === 'reset' && menu.current === 'welcome' ? exitButton.style.display = 'none' : exitButton.removeAttribute('style');
}