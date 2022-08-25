function firefoxBanner() {

	var userAgent = navigator.userAgent;
	var vendor = null;
	if (navigator.vendor) {
		vendor = navigator.vendor;
	}
	var browser = 'Unknown Web Browser';

	var isBrowserFirefox = false;

	var deprecationWarning = 'Your current web browser is obsolete';
	var callToAction = "Let's get a free web together";
	var bannerBtnText = 'Get Firefox';

	// Language
	if (navigator.language.match(/^es$|^es-/ig)) {

		deprecationWarning = 'Su navegador actual es obsoleto';
		callToAction = 'Logremos una web libre juntos';
		bannerBtnText = 'Obten Firefox';
	}

	try {

		// Firefox
		if (userAgent.match(/firefox/ig) && vendor.match(/(^$|null)/ig)) {

				browser = 'Mozilla Firefox';
				isBrowserFirefox = true;
		}

		// Microsoft Internet Explorer
		userAgent.match(/\b(MSIE|Trident)/ig) ? browser = 'Internet Explorer' : null;

		if (isBrowserFirefox === false) {

			var deprecationWarningHTML = '';
			if (browser.match(/Internet Explorer/ig)) {
				deprecationWarningHTML = `<p id="deprecation-warning"><b><span>${deprecationWarning}</span></b></p>`;
			}

			// Check for XMLHttpRequest feature and fallback to IE legacy syntax if feature is not supported
			var xhr = null;
			if (window.XMLHttpRequest) {
				xhr = new XMLHttpRequest();
			} else {
				xhr = new ActiveXObject('Microsoft.XMLHTTP');
			}

			xhr.open('GET', '/firefox-banner/styles.css');
			xhr.onreadystatechange = function() {
				if (xhr.readyState === 4) {

					var styles = document.createElement('link');
					styles.rel = 'stylesheet';
					styles.type = 'text/css';
					styles.href = '/firefox-banner/styles.css';
					styles.onload = function() {
						document.body.insertAdjacentHTML('beforeEnd', 
						`<aside id="firefox-banner-container">
							<a href="https://www.mozilla.org/firefox/new/" target="_BLANK">
								<div id="firefox-banner-wrap">
									<figure id="firefox-logo-fig">
										<img id="firefox-logo" src="/firefox-banner/logo/firefox-logo.svg">
									</figure>
									<div>
										${deprecationWarningHTML}
										<p><span id="ff-banner-msg">${callToAction}</span></p>
										<p class="ff-btn">${bannerBtnText}</p>
									</div>
								</div>
							</a>
							<div id="ff-close-firefox-banner">X</div>
						</aside>`
						);

						var closeBannerBtn = document.querySelector('#ff-close-firefox-banner');
						closeBannerBtn.addEventListener('click', function(event) {
							document.querySelector('#firefox-banner-container').remove();
						});
					}
					document.body.insertAdjacentElement('beforeEnd', styles);
				}
			}
			xhr.send();
		}
	} catch(error) {

		if (browser.match(/Internet Explorer/ig)) {
			
			var alertMsg = 'Web browser: ' + browser;
			alert(deprecationWarning + '\n' + bannerBtnText);

			if (typeof console !== 'undefined') {
				if (console.debug) {
					console.debug(alertMsg);
				} else {
					console.info(alertMsg);
				}
			}
		}
	}
}

firefoxBanner();