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

	var doc, meta, cardImgSrc, cardTitle, cardDescription, cardProjectType = projecType;

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
				}
			}

			if (!(!cardTitle && !cardDescription && !cardImgSrc)){


				var cardHTMLTemplate = `<div class="project-card" style="opacity: 0; transform: translateY(-20px);">
	<a class="project-link" href="${url}" target="_blank">
		<h4 class="project-card-title">${cardTitle}</h4>
		<figure class="project-card-img-wrap">
			<img class="project-card-img" src="${cardImgSrc}" alt="${cardTitle}">
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
	var cardImgs = document.getElementsByClassName('project-card-img-wrap');

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


navigator.language.match(/^es$|es-/) ? clientLanguage = 'es' : undefined;
navigator.language.match(/^en$|en-/) ? clientLanguage = 'en' : undefined;
navigator.language.match(/^ge$|ge-/) ? clientLanguage = 'ge' : undefined;
navigator.language.match(/^ja$|ja-/) ? clientLanguage = 'ja' : undefined;

var htmlTag = document.getElementsByTagName('html')[0];
htmlTag.lang = clientLanguage;

var languageSelect = document.getElementById('language-select');
var languageSelectLabel = document.getElementById('language-select-label');

var flagImg = document.getElementById('language-flag');

var projectsTitle = document.getElementById('projects-title');
var professionTitle = document.getElementById('profession-title');
var footerColumnsTitles = document.getElementsByClassName('footer-column-title');

for(var i = 0; i < languageSelect.childElementCount; i++){
	languageSelect.children[i].value === clientLanguage ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;	
}

function test(e){
	console.log(e);
};

var xhrLanguage = new XMLHttpRequest();

var jsonResponse, languages, docLanguage;

xhrLanguage.onreadystatechange = function(){
	if(xhrLanguage.status === 200 && xhrLanguage.readyState === 4){
		jsonResponse = JSON.parse(xhrLanguage.response);
		languages = jsonResponse;

		switch(clientLanguage){
			case '':
				undefined;
			break;
			case 'es':
				docLanguage = jsonResponse['es'];
			break;
			case 'en':
				docLanguage = jsonResponse['en'];
			break;
			case 'ge':
				docLanguage = jsonResponse['ge'];
			break;
			case 'ja':
				docLanguage = jsonResponse['ja'];
			break;
		}

		docLanguage = languages[languageSelect.value];
		languageSelect.children[0].innerText = docLanguage.spanish;
		languageSelect.children[1].innerText = docLanguage.english;
		languageSelect.children[2].innerText = docLanguage.german;
		languageSelect.children[3].innerText = docLanguage.japanese;

		languageSelectLabel.innerText = docLanguage.selectLanguage;

		flagImg.src = docLanguage.flagURL;

		professionTitle.innerText = docLanguage.webDeveloper + ' - ' + docLanguage.gameDeveloper;
		projectsTitle.innerText = docLanguage.projects;

		footerColumnsTitles[0].innerText = docLanguage.pages;
		footerColumnsTitles[1].innerText = docLanguage.projects;
		footerColumnsTitles[2].innerText = docLanguage.contact;

	}

};
xhrLanguage.open('GET', 'languages/supported-languages.json');
xhrLanguage.send();

function updateLanguage(){

	docLanguage = languages[languageSelect.value];

	htmlTag.lang != languageSelect.value ? htmlTag.lang = languageSelect.value : undefined;

	languageSelect.children[0].innerText = docLanguage.spanish;
	languageSelect.children[1].innerText = docLanguage.english;
	languageSelect.children[2].innerText = docLanguage.german;
	languageSelect.children[3].innerText = docLanguage.japanese;

	for(var i = 0; i < languageSelect.childElementCount; i++){
		languageSelect.children[i].value === languageSelect.value ? languageSelect.children[i].selected = true : languageSelect.children[i].selected = false;
	}

	if(languageSelect.value != (''||null||undefined)){

		languageSelectLabel.innerText = docLanguage.selectLanguage;

		flagImg.src = docLanguage.flagURL;

		professionTitle.innerText = `${docLanguage.webDeveloper} ${docLanguage.hyphen} ${docLanguage.gameDeveloper}`;
		projectsTitle.innerText = docLanguage.projects;

		footerColumnsTitles[0].innerText = docLanguage.pages;
		footerColumnsTitles[1].innerText = docLanguage.projects;
		footerColumnsTitles[2].innerText = docLanguage.contact;
	}
}

languageSelect.addEventListener('change', updateLanguage);
