function firefoxBanner() {

	let browserInfo = navigator.userAgent;
	let browser = 'Unknown';

	let browserIsFirefox = false;

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
		`<style>
			#firefox-banner-container {
				box-sizing: border-box;
				z-index: 9999;
				position: fixed;
				right: 1rem;
				bottom: 1rem;
				background: linear-gradient(45deg, white, #e3e3e3);
				font-family: sans-serif;
				border-radius: 10px;
				box-shadow: 0 0 2px rgba(0,0,0, 0.5);
				animation: slideIn linear 0.5s
			}

			#firefox-banner-container a {
				text-decoration: none;
			}

			#firefox-banner-wrap {
				display: flex;
				flex-flow: row nowrap;
				justify-content: center;
				align-items: center;
				color: black;
				gap: 1rem;
				padding: 1rem;
				padding-right: 1.5rem;
			}

			#firefox-logo-fig {
				width: 55px;
				height: 55px;
				margin: auto;
			}

			#firefox-logo-fig img {
				width: 100%;
				height: 100%;
			}

			.ff-btn {
				background: linear-gradient(180deg, green, forestgreen);
				color: white;
				font-weight: bold;
				width: -webkit-fit-content;
				width: -moz-fit-content;
				width: fit-content;
				padding: 0.5rem;
				text-align: center;
				padding: 0.5rem 1rem;
				margin: auto;
				border-radius: 10px;
			}

			#close-firefox-banner {
				position: absolute;
				top: 0.5rem;
				right: 0.5rem;
				font-family: monospace;
				color: gray;
				font-weight: bold;
				cursor: default;
			}

			@keyframes slideIn {
				0% {
					transform: translateX(100%);
				},
				100% {
					transform: none;
				}
			}
		</style>
		<aside id="firefox-banner-container">
			<a href="https://www.mozilla.org/firefox/new/" target="_BLANK">
				<div id="firefox-banner-wrap">
					<figure id="firefox-logo-fig">
						<img id="firefox-logo" src="/images/firefox-logo.svg">
					</figure>
					<div>
						<p>Let's keep the web free!</p>
						<p class="ff-btn">Get Firefox</p>
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