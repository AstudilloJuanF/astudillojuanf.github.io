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
		opacity: 0.5;
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
			<svg id="icon-top" enable-background="new 0 0 98.148 98.149" version="1.1" viewBox="0 0 98.13 64.226" xml:space="preserve">
				<path d="m48.971 2.1263c-15.49 15.774-31.928 31.366-46.84 47.252 4.3647 4.0112 8.5039 9.1643 12.988 12.572 11.293-11.293 22.586-22.586 33.879-33.879 11.386 11.317 22.724 22.857 34.139 34.037 4.2694-4.3276 8.7564-8.6446 12.895-12.979-15.692-15.654-31.341-31.42-47.061-47.004z" stroke="#ffff" stroke-width="3"/>
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
			goTopLink.setAttribute('style', 'opacity: 1');
		}else{
			goTopLink.removeAttribute('style');
		}
	}
}

window.addEventListener('load', toggleUpArrow);
window.addEventListener('scroll', toggleUpArrow);
