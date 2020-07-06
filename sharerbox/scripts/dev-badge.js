var badgeHTML = `<section class="disclaimer">
	<style type="text/css">
		#developer-badge{
			z-index: 999;
			display: none;
			position: fixed;
			text-align: center;
			left: 0;
			right: 0;
			bottom: 50px;
			background: #404040;
			color: black;
			width: fit-content;
			height: auto;
			margin: auto;
			padding: 11px;
			box-shadow: 0 0 5px rgb(0,0,0, 0.5);
			transform: scale(0.98);
			transition: 0.12s ease;
		}

		#developer-badge:hover{
			transform: none;
			box-shadow: 0 0 7px rgb(0,0,0, 0.5);
		}

		#developer-badge p{
			color: ghostwhite;
			margin: auto;
			margin-bottom: 0.5rem;
		}

		#developer-badge a{
			/*font-size: 0.9rem;*/
			font-weight: bold;
			display: block;
			color: skyblue;
			margin: 0.5rem;
		}

		#developer-badge a:active{
			color: red;
		}

		#developer-badge a:hover{
			color: dodgerblue;
		}

		#developer-badge figure{
			width: 150px;
			height: 150px;
			margin: 0;
			padding: 0;
		}

		#developer-badge img{
			object-fit: cover;
			width: 100%;
			height: 100%;
			border: solid 2.5px skyblue;
			border-radius: 100%;
		}

		#badge-wrapper{
			display: block;
			width: fit-content;
			height: auto;
			margin: auto;
		}

		#badge-text-wrapper{
			margin: auto;
			border: solid 1px transparent;
		}

		#close-badge{
			display: block;
			position: absolute;
			float: right;
			overflow: hidden;
			top: 0;
			right: 0;
			background-color: crimson;
			width: 40px;
			height: 40px;
			margin: -12.5px;
			border-radius: 100%;
			box-shadow: 0 0 5px rgb(0,0,0, 0.5);
		}

		#close-badge:hover{
			background-color: red;
			transform: scale(1.1);
		}

		#close-badge:hover #x-line1{
			transform: rotate(45deg);
			transform-origin: center;
		}

		#close-badge:hover #x-line2{
			transform: rotate(-45deg);
			transform-origin: center;
		}
	</style>
	<div id="developer-badge">
		<div id="close-badge">
			<object>
				<svg width="40" height="40">
					<line id="x-line1" x1="10" y1="20" x2="30" y2="20" stroke="white" stroke-width="4" stroke-linecap="round"/>
					<line id="x-line2" x1="10" y1="20" x2="30" y2="20" stroke="white" stroke-width="4" stroke-linecap="round"/>
				</svg>
			</object>
		</div>
		<div id="badge-wrapper">
			<figure>
				<img src="./images/developer.jpg" alt="Site Developer">
			</figure>
			<div id="badge-text-wrapper">
				<p style="font-weight:bold; margin-top: 0.5rem;">Juan Astudillo</p>
				<div style="Display: flex; flex-flow: row nowrap; justify-content: center;">
					<object style="display: block;" width="22px" height="22px">
						<svg width="22px" height="22px" viewBox="0 0 128 128">
							<polygon fill="#558d6c" points="4.92 8 15.09 95.05 64 119.95 64 8 4.92 8"/>
							<polygon fill="#5aa579" points="64 8 64 8.02 64 119.95 64.05 120 112.98 95.09 123.08 8 64 8"/>
							<polygon fill="#60be86" points="18.84 22.11 25.33 87.29 64 105.97 64 22.11 18.84 22.11"/>
							<polygon fill="#65d693" points="64 22.11 64 22.11 64 105.97 64.05 106.02 102.74 87.26 109.16 22.11 64 22.11"/>
							<path fill="#5aa579" d="M105.72,54.9,73.14,39.42l-1.83-.9-1.12,2.28L64,53.41V68.3l9.15-18.08,21.5,9.57L71.56,70.16l-.87.47,0,1.56v6.18l0,3.14L73,80.38l32.78-15.69a2,2,0,0,0,.92-2V56.91A2,2,0,0,0,105.72,54.9Z"/>
							<path fill="#558d6c" d="M56,69.39l-21.79-9.6L57.51,49.42l1.76-.7,0-1.33V37.76L55.87,39.2,21.94,54.89a2.26,2.26,0,0,0-1.28,2v5.77a2.22,2.22,0,0,0,1.24,2L55.34,80.18l2,.9,1.21-2.26L64,68.3V53.41Z"/>
						</svg>
					</object>
					<p style="margin: auto 3px; padding:0;">Developer</p>
				</div>
				<a href="https://www.linkedin.com/in/juan-astudillo" target="_blank" title="Profile">LinkedIn</a>
				<a href="https://www.fiverr.com/users/astudillo_juan" target="_blank" title="Commissions">Fiverr</a>
				<a href="https://github.com/AstudilloJuanF" target="_blank" title="Repositories">GitHub</a>
				<address><a href="mailto:astudillojuanfrancisco@gmail.com" title="astudillojuanfrancisco@gmail.com">E-mail</a></address>
			</div>
		</div>
	</div>
</section>`;

(function(){
	document.body.insertAdjacentHTML('beforeend', badgeHTML);
})();

var disclaimerText = document.getElementById('author-disclaimer');
var badge = document.getElementById('developer-badge');
var closeButton = document.getElementById('close-badge');

function showBadge(){
	badge.style.display = 'block';
	return true;
}

disclaimerText.addEventListener('click', showBadge);

function hideBadge(){
	badge.style.display = '';
}

closeButton.addEventListener('click', hideBadge);
