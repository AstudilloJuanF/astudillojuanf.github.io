var scrollTopHTML = `<style type="text/css">
	#scroll-top-icon-container{
		width: 40px;
		height: 40px;
		margin: auto;
		padding: 0;
	}

	#go-top-link{
		position: sticky;
		display: block;
		opacity: 0;
		bottom: 0;
		width: fit-content;
		height: fit-content;
		margin: auto;
		margin-top: 5rem;
		transition: 0.25s linear;
	}

	#go-top-link:hover{
		opacity: 1;
		transform: scale(1.2);
	}

	#icon-top{
		fill: black;
	}
</style>
<div id="go-top-link">
	<figure id="scroll-top-icon-container">
		<object>
			<svg id="icon-top" version="1.1" viewBox="0 0 496.95 305.75" xml:space="preserve" xmlns="http://www.w3.org/2000/svg">
				<g transform="translate(4.974 -90.626)" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="20">
					<path d="m397.7 376.1c20.4 20.4 53.6 20.4 74 0s20.4-53.6 0-74l-191.2-191.2c-20.4-20.4-53.6-20.4-74 0l-191.2 191.2c-20.4 20.4-20.4 53.6 0 74s53.6 20.4 74 0l154.2-154.2z" stroke="#fff" stroke-linecap="round" stroke-linejoin="round" stroke-width="20"/>
				</g>
			</svg>
		</object>
	</figure>
</div>
`;

(function(){
	var footer = document.getElementsByTagName('footer')[0];
	footer.insertAdjacentHTML('beforebegin', scrollTopHTML)
})();

var goTopLink = document.getElementById('go-top-link');

function goUp(){
	window.scrollTo({top:0, behavior:'smooth'});
}

goTopLink.addEventListener('click', goUp);

//-------------------------------------------------------------

function toggleUpArrow(){

	var scrollPosition = window.pageYOffset;

	if(scrollPosition === 0){
		goTopLink.style.opacity = '0';
	}else{
		if(window.pageYOffset === (document.body.offsetHeight - window.innerHeight)){
			goTopLink.style.opacity = '1';
		}else{
			goTopLink.style.opacity = '0.5';
		}
	}
}

window.addEventListener('load', toggleUpArrow);
window.addEventListener('scroll', toggleUpArrow);
