// responsive footer section

const doc = document.body;
const footer = document.getElementsByTagName('footer')[0];

function responsivePageFooter(){
    doc.style.minHeight = `${window.innerHeight}px`;

    if (footer.offsetTop < doc.offsetHeight - footer.offsetHeight){
        footer.setAttribute('style', 'position: absolute; left: 0; right: 0; bottom: 0;');
    } else {
        footer.removeAttribute('style');
    }
}

window.addEventListener('load', responsivePageFooter);
window.addEventListener('resize', responsivePageFooter);
window.addEventListener('deviceorientation', responsivePageFooter);

//--------------------------------------------------------------------------------



// AJAX project snippet cards

const projectSection = document.getElementById('projects-section');

function requestProjectCard(url, projecType){

	var doc, meta, cardImgSrc, cardVideoSrc, cardTitle, cardDescription, cardProjectType = projecType;

	var xhr = new XMLHttpRequest();
	xhr.onreadystatechange = function(){
		if (xhr.status === 200 && xhr.readyState === 4) {

			doc = xhr.response; // doc = new DOMParser().parseFromString(xhr.response, 'text/html');
			meta = doc.head.getElementsByTagName('meta');

			for (var i = 0; i < meta.length; i++){
				if (meta[i].hasAttribute('property')){
					meta[i].attributes.property.value === 'og:title' && !cardTitle ? cardTitle = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:description' && !cardDescription ? cardDescription = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:image' && !cardImgSrc ? cardImgSrc = meta[i].content : undefined;
					meta[i].attributes.property.value === 'og:video' && !cardVideoSrc ? cardVideoSrc = meta[i].content : undefined;
				}
			}

			if (!(!cardTitle && !cardDescription && !cardImgSrc)){

				if (typeof cardVideoSrc != 'undefined')  {
					var cardvideoHTMLTemplate = `<video class="project-card-video" src="${cardVideoSrc}" type="video/mp4" muted loop></video>`;
				} else {
					var cardvideoHTMLTemplate = '';
				}


				var cardHTMLTemplate = `<div class="project-card" style="opacity: 0; transform: translateY(-20px);">
	<a class="project-link" href="${url}" target="_blank">
		<h4 class="project-card-title">${cardTitle}</h4>
		<figure class="project-card-media-wrap">
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

				setTimeout(function(){
					currentCard.setAttribute('style', 'opacity: 1; transform: none;');
					currentCard.removeAttribute('style');
				}, 1000);
			}

			resizeCards();
			responsivePageFooter();

			var projectCards = projectSection.getElementsByClassName('project-card');

			for(var i = 0; i < projectCards.length; i++){

				projectCards[i].setAttribute('data-id', i);
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

requestProjectCard('boosterlander/', '2D Minigame');
requestProjectCard('sharerbox/', 'Frontent Development');

function resizeCards(){
	var cardImgs = document.getElementsByClassName('project-card-media-wrap');

	for (var i = 0; i < cardImgs.length; i++){

		if (document.body.offsetWidth <= 450){
			cardImgs[i].style.width = `${document.body.offsetWidth * 0.95}px`;
			cardImgs[i].style.height = `${cardImgs[i].offsetWidth * (52.25 / 100)}px`;
		} else {
			cardImgs[i].removeAttribute('style');
		}
	}
}

window.addEventListener('load', resizeCards);
window.addEventListener('resize', resizeCards);
window.addEventListener('deviceorientation', resizeCards);

// -----------------------------------------------------------------------------------


			/* Languages */

const languagesArray = ['es','en','de','ja'];
const defaultLanguage = 'en';

var currentLanguage = defaultLanguage;
var clientLanguage = navigator.language.substr(0,2);

for(var i = 0; i < languagesArray.length; i++){
	if (languagesArray[i] === clientLanguage){

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

for(var i = 0; i < languageSelect.childElementCount; i++){
	languageSelect.children[i].value === currentLanguage ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;	
}

var xhrLanguage = new XMLHttpRequest();

var languages, languageJSON;

xhrLanguage.onreadystatechange = function(){
	if(xhrLanguage.status === 200 && xhrLanguage.readyState === 4){
		languages = JSON.parse(xhrLanguage.response);

		languageJSON = languages[currentLanguage];

		updateLanguage();

	}

};
xhrLanguage.open('GET', 'languages/supported-languages.json');
xhrLanguage.send();

function updateLanguage(){

	languageJSON = languages[languageSelect.value];

	htmlTag.lang != languageSelect.value ? htmlTag.lang = languageSelect.value : undefined;

	languageSelect.children[0].innerText = languageJSON.spanish;
	languageSelect.children[1].innerText = languageJSON.english;
	languageSelect.children[2].innerText = languageJSON.german;
	languageSelect.children[3].innerText = languageJSON.japanese;

	for(var i = 0; i < languageSelect.childElementCount; i++){
		languageSelect.children[i].value === languageSelect.value ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;
	}

	if(languageSelect.value != (''||null||undefined)){

		languageSelectLabel.innerText = languageJSON.selectLanguage;

		for(var i = 0; i < flagImg.length; i++){
			languageSelect.children[i].selected ? flagImg[i].style.display = 'block' : flagImg[i].removeAttribute('style');
		}

		professionTitle.innerText = `${languageJSON.webDeveloper} ${languageJSON.hyphen} ${languageJSON.gameDeveloper}`;
		projectsTitle.innerText = languageJSON.projects;

		footerColumnsTitles[0].innerText = languageJSON.pages;
		footerColumnsTitles[1].innerText = languageJSON.projects;
		footerColumnsTitles[2].innerText = languageJSON.contact;
		footerColumnsTitles[2].nextElementSibling.firstElementChild.title = languageJSON.email;
	}
}

languageSelect.addEventListener('change', updateLanguage);

projectsTitle.addEventListener('click', function(e){
	window.scrollTo({top: e.target.offsetHeight, behavior: 'smooth'});
});

window.addEventListener('scroll', function(){

	var shadowVal;

	window.scrollY < projectsTitle.parentElement.offsetTop ? shadowVal = 'none' : shadowVal = '0 2.5px 2.5px rgba(0,0,0, 0.125)';
	projectsTitle.style.boxShadow = shadowVal;
});


// ----------------------------------------------------------------------------------

					/* Video playback */

function toggleCardVideo(e){
	var projectCardVideo = e.target.getElementsByTagName('video')[0];
	var projectCardImage = e.target.getElementsByTagName('img')[0];
	var currentCardId = e.target.getAttribute('data-id');
	
	if (typeof projectCardVideo != 'undefined'){

		projectCardImage.style.opacity = '0';
		projectCardVideo.style.display = 'block';
		projectSection.style.background = 'white';
		projectCardVideo.play();

		function stopCardVideo(){

			var transitionDuration = Number(window.getComputedStyle(projectCardImage).getPropertyValue('transition-duration').replace(/s/, ''));

			projectCardVideo.pause();

			projectCardImage.removeAttribute('style');

			setTimeout(	function(){

				projectCardVideo.currentTime = 0;
				projectCardVideo.removeAttribute('style');
				
			}, transitionDuration * 1000);
		}

		if (!navigator.platform.toLowerCase().match(/^win*|^mac|^linux[ ]{1}x86/)){
			document.ontouchstart = function(event){
				var isProjectCard;
				for (var i = 0; i < event.path.length; i++){
					if (event.path[i].className === 'project-card' && event.path[i].getAttribute('data-id') === currentCardId){
						isProjectCard = true;
						break;
					}else{
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
