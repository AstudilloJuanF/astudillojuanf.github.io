// responsive footer section

const doc = document.body;
const footer = document.getElementsByTagName('footer')[0];

function responsivePageFooter() {
    doc.style.minHeight = `${window.innerHeight}px`;

    if (footer.offsetTop < doc.offsetHeight - footer.offsetHeight) {
        footer.setAttribute('style', 'position: absolute; left: 0; right: 0; bottom: 0;');
    } else {
        footer.removeAttribute('style');
    }
}

window.addEventListener('load', responsivePageFooter);
window.addEventListener('resize', responsivePageFooter);
window.addEventListener('deviceorientation', responsivePageFooter);


// -----------------------------------------------------------------------------------


			/* Languages */

const languagesArray = ['es','en','de','ja'];
const defaultLanguage = 'en';

var currentLanguage = defaultLanguage;
var clientLanguage = navigator.language.substr(0,2);

for (var i = 0; i < languagesArray.length; i++) {
	if (languagesArray[i] === clientLanguage) {

		currentLanguage = clientLanguage;
		break;

	} else {
		currentLanguage = defaultLanguage;
	}
}

var htmlTag = document.firstElementChild;
htmlTag.lang = currentLanguage;

var languageSelect = document.getElementById('language-select');
var languageSelectLabel = document.getElementById('language-select-label');

var flagImg = document.getElementsByClassName('language-flag');

var projectsTitle = document.getElementById('projects-title');
var professionTitle = document.getElementById('profession-title');
var footerColumnsTitles = document.getElementsByClassName('footer-column-title');

for (var i = 0; i < languageSelect.childElementCount; i++) {
	languageSelect.children[i].value === currentLanguage ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;	
}

var languages, languageJSON;

var xhrLanguage = new XMLHttpRequest();

var languagePromise = new Promise((resolve, reject)=>{
	xhrLanguage.onreadystatechange = function() {

		if (xhrLanguage.status === 200 && xhrLanguage.readyState === 4) {
			languages = JSON.parse(xhrLanguage.response);
	
			languageJSON = languages[currentLanguage];
	
			resolve('languages loaded');
	
		} else if (xhrLanguage.status.toString().match(/404|403|500/)) {
			reject('not found');
		}
	};
	
	xhrLanguage.open('GET', 'languages/supported-languages.json');
	xhrLanguage.send();
});

languagePromise.then((fulfilled)=>{
	requestProjectCard('boosterlander/', `${languageJSON.minigame} (2D)`, 'boosterlander, 2D minigame');
	requestProjectCard('sharerbox/', `${languageJSON.development} (${languageJSON.frontend})`, 'sharerbox, frontend development');
	updateLanguage();
})
.catch((rejected)=>{
	requestProjectCard('boosterlander/', '2D Minigame', '2D minigame');
	requestProjectCard('sharerbox/', 'Frontend Development', 'frontend development');
});

function updateLanguage() {

	languageJSON = languages[languageSelect.value];

	htmlTag.lang != languageSelect.value ? htmlTag.lang = languageSelect.value : undefined;

	function originalLanguage(language) {

		var returnLanguage;

		switch(language) {
			case 'es':
				returnLanguage = languages.es.spanish;
			break;
			case 'en':
				returnLanguage = languages.en.english;
			break;
			case 'de':
				returnLanguage = languages.de.german;
			break;
			case 'ja':
				returnLanguage = languages.ja.japanese;
			break;
		}

		returnLanguage = `(${returnLanguage})`;

		if (language === htmlTag.lang) {
			returnLanguage = '';
		}

		return returnLanguage;
	};

	languageSelect.children[0].innerText = `${languageJSON.spanish} ${originalLanguage('es')}`;
	languageSelect.children[1].innerText = `${languageJSON.english} ${originalLanguage('en')}`;
	languageSelect.children[2].innerText = `${languageJSON.german} ${originalLanguage('de')}`;
	languageSelect.children[3].innerText = `${languageJSON.japanese} ${originalLanguage('ja')}`;

	for (var i = 0; i < languageSelect.childElementCount; i++) {
		languageSelect.children[i].value === languageSelect.value ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;
	}

	if (languageSelect.value != (''||null||undefined)) {

		languageSelectLabel.innerText = languageJSON.chooseLanguage;

		for (var i = 0; i < flagImg.length; i++) {
			languageSelect.children[i].selected ? flagImg[i].style.display = 'block' : flagImg[i].removeAttribute('style');
		}

		document.getElementById('web-developer-title').innerText = languageJSON.webDeveloper;
		document.getElementById('game-developer-title').innerText = languageJSON.gameDeveloper;
		projectsTitle.innerText = languageJSON.projects;

		footerColumnsTitles[0].innerText = languageJSON.pages;
		footerColumnsTitles[1].innerText = languageJSON.projects;
		footerColumnsTitles[2].innerText = languageJSON.contact;
		footerColumnsTitles[2].nextElementSibling.firstElementChild.title = languageJSON.email;
	}

	var projectCards = projectSection.getElementsByClassName('project-card');

	if (typeof projectCards !== 'undefined') {
		for (var i = 0; i < projectCards.length; i++) {

			var tags = projectCards[i].getAttribute('data-tags').split(',');
			
			var typeElement = projectCards[i].getElementsByClassName('project-type')[0];

			for (var u = 0; u < tags.length; u++) {

				tags[u] = tags[u].trim();

				var typeText;

				tags[u].match(/boosterlander/i) ? typeText = `${languageJSON.minigame} (2D)` : undefined;
				tags[u].match(/sharerbox/i) ? typeText = `${languageJSON.development} (${languageJSON.frontend})` : undefined;

				typeElement.innerText = typeText;
			}
		}
	}
}

languageSelect.addEventListener('change', updateLanguage);

projectsTitle.addEventListener('click', function(e) {
	window.scrollTo({top: e.target.offsetHeight, behavior: 'smooth'});
});

window.addEventListener('scroll', function() {

	var shadowVal;

	window.scrollY < projectsTitle.parentElement.offsetTop ? shadowVal = 'none' : shadowVal = '0 2.5px 2.5px rgba(0,0,0, 0.125)';
	projectsTitle.style.boxShadow = shadowVal;
});

//--------------------------------------------------------------------------------


// AJAX project snippet cards

const projectSection = document.getElementById('projects-section');

function requestProjectCard(url, projecType, projectTags) {

	var doc, meta, cardImgSrc, cardVideoSrc, cardTitle, cardDescription; 
	var cardProjectType = projecType, cardProjectTags = projectTags;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function() {
		if (xhr.status === 200 && xhr.readyState === 4) {

			doc = xhr.response; // doc = new DOMParser().parseFromString(xhr.response, 'text/html');
			meta = doc.head.getElementsByTagName('meta');

			for (var i = 0; i < meta.length; i++) {
				if (meta[i].hasAttribute('property')) {
					meta[i].attributes.property.value === 'og:title' && !cardTitle ? cardTitle = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:description' && !cardDescription ? cardDescription = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:image' && !cardImgSrc ? cardImgSrc = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:video' && !cardVideoSrc ? cardVideoSrc = meta[i].content : undefined;
				}
			}

			if (!(!cardTitle && !cardDescription && !cardImgSrc)) {

				if (typeof cardVideoSrc != 'undefined')  {
					var cardvideoHTMLTemplate = `<video class="project-card-video" src="${cardVideoSrc}" type="video/mp4" muted loop></video>`;
				} else {
					var cardvideoHTMLTemplate = '';
				}


				var cardHTMLTemplate = `<div class="project-card" style="opacity: 0; transform: translateY(-20px);" data-tags="${cardProjectTags}">
	<a class="project-link" href="${url}">
		<h4 class="project-card-title">${cardTitle}</h4>
		<figure class="project-card-media-wrap">
				<p class="media-card-loading">Loading...</p>
			<img class="project-card-img" src="${cardImgSrc}" alt="${cardTitle}">
			${cardvideoHTMLTemplate}
		</figure>
		<div class="pj-card-description-box">
			<p class="pj-card-description">${cardDescription}</p>
		</div>
		<p class="project-type">${cardProjectType}</p>
	</a>
</div>`;

				projectSection.insertAdjacentHTML('beforeend', cardHTMLTemplate);
				
				var currentCard = document.getElementsByClassName('project-card');
				currentCard = currentCard[currentCard.length-1];

				setTimeout(function() {
					currentCard.setAttribute('style', 'opacity: 1; transform: none;');
					currentCard.removeAttribute('style');
				}, 1000);

				var currentCardImg = currentCard.getElementsByTagName('img')[0];
				currentCardImg.dataset.state = '';

				currentCardImg.onerror = () => {
					currentCardImg.style.opacity = 0;
					currentCardImg.loading = 'eager';
					currentCardImg.dataset.state = 'failed';
				};
				currentCardImg.onload = ()=> {
					currentCardImg.style.opacity = 1;
					currentCardImg.dataset.state = 'loaded';
				};

				currentCardImg.onmouseover = () => {
					if (currentCardImg.getAttribute('data-state') === 'failed') {
						currentCardImg.src = currentCardImg.src;
					}
				};

				var currentCardVideo = currentCard.getElementsByClassName('project-card-video')[0];
				var currentCardLoadMsg = currentCard.getElementsByClassName('media-card-loading')[0];

				if (typeof currentCardVideo !== 'undefined') {
					currentCardVideo.addEventListener('playing', (e) => {
						if (e.target.readyState === 4) {
							currentCardLoadMsg.style.opacity = 0;
						}
					}); 
					currentCardVideo.onstop = ()=> currentCardLoadMsg.style.opacity = 1;
				}
			}

			resizeCards();
			responsivePageFooter();

			var projectCards = projectSection.getElementsByClassName('project-card');

			for (var i = 0; i < projectCards.length; i++) {

				projectCards[i].dataset.id = i;
				
				projectCards[i].removeEventListener('pointerenter', toggleCardVideo);
				projectCards[i].addEventListener('pointerenter', toggleCardVideo);
			}

		} else {
			//handle error
		}
	};

	xhr.responseType = 'document';
	xhr.open('GET', url);
	xhr.send();
}

function resizeCards() {
	var cardImgs = document.getElementsByClassName('project-card-media-wrap');

	for (var i = 0; i < cardImgs.length; i++) {

		if (document.body.offsetWidth <= 450) {
			cardImgs[i].style.width = `${document.body.offsetWidth * 0.925}px`;
			cardImgs[i].style.height = `${cardImgs[i].offsetWidth * (52.25 / 100)}px`;
		} else {
			cardImgs[i].removeAttribute('style');
		}
	}
}

window.addEventListener('load', resizeCards);
window.addEventListener('resize', resizeCards);
window.addEventListener('deviceorientation', resizeCards);



// ----------------------------------------------------------------------------------


					/* Video playback */

function toggleCardVideo(e) {
	var projectCardVideo = e.target.getElementsByTagName('video')[0];
	var projectCardImage = e.target.getElementsByTagName('img')[0];
	var currentCardId = e.target.getAttribute('data-id');
	
	if (typeof projectCardVideo != 'undefined') {

		projectCardImage.style.opacity = '0';
		projectCardVideo.style.display = 'block';
		projectSection.style.background = 'white';
		projectCardVideo.play();

		function stopCardVideo() {

			var transitionDuration = Number(window.getComputedStyle(projectCardImage).getPropertyValue('transition-duration').replace(/s/, ''));

			projectCardVideo.pause();

			if (projectCardImage.complete) {
				projectCardImage.src = projectCardImage.src;
				projectCardImage.style.opacity = 1;
			}

			setTimeout(	function() {

				projectCardVideo.currentTime = 0;
				projectCardVideo.removeAttribute('style');
				
			}, transitionDuration * 1000);
		}

		if (!navigator.platform.toLowerCase().match(/^win*|^mac|^linux[ ]{1}x86/)) {
			document.ontouchstart = function(event) {
				var isProjectCard;
				for (var i = 0; i < event.path.length; i++) {
					if (event.path[i].className === 'project-card' && event.path[i].getAttribute('data-id') === currentCardId) {
						isProjectCard = true;
						break;
					} else {
						isProjectCard = false;
					}
				}
				isProjectCard === false ? stopCardVideo() : undefined;
			};
		} else {
			e.target.onpointerleave = ()=> stopCardVideo();
		}

	}

}