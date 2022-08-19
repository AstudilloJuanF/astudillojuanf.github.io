function firefoxBanner() {

	let browserInfo = navigator.userAgent;
	let browser = 'Unknown';

	let browserIsFirefox = false;

	let bannerDescription = 'Let\'s make a free web together';
	let bannerBtnMsg = 'Get Firefox';
	
	if (navigator.language.match(/^es$|^es-/ig)) {
		bannerDescription = 'Hagamos una web libre juntos';
		bannerBtnMsg = 'Obten Firefox';
	}

	if (!navigator.brave) {

		if (browserInfo.includes('Firefox')) {

			browser = 'Mozilla Firefox';
			browserIsFirefox = true;
		}

		browserInfo.includes('Chrome') ? browser = 'Google Chrome' : null;
		browserInfo.includes('Safari') ? browser = 'Safari Web Browser' : null;

	} else {

		browser = 'Brave Browser';
	}

	if (browserIsFirefox === false) {
		document.body.insertAdjacentHTML('beforeEnd', 
		`<link rel="stylesheet" type="text/css" href="/firefox-banner/styles.css">
		<aside id="firefox-banner-container">
			<a href="https://www.mozilla.org/firefox/new/" target="_BLANK">
				<div id="firefox-banner-wrap">
					<figure id="firefox-logo-fig">
						<img id="firefox-logo" src="/firefox-banner/logo/firefox-logo.svg">
					</figure>
					<div>
						<p><span id="ff-banner-msg">${bannerDescription}</span></p>
						<p class="ff-btn">${bannerBtnMsg}</p>
					</div>
				</div>
			</a>
			<div id="close-firefox-banner">X</div>
		</aside>`
		);

		let closeBannerBtn = document.querySelector('#firefox-banner-container').querySelector('#close-firefox-banner');
		closeBannerBtn.addEventListener('click', (event) => {
			document.querySelector('#firefox-banner-container').remove();
		});
	}
}

firefoxBanner();