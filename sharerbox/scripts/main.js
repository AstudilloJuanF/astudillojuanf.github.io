/*
var githubBtnText = document.getElementById('github-btn-sharerbox-version-text');

window.addEventListener('load', function(){

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function(){
        if (xhr.status === 200 && xhr.readyState === 4) {
            var responseFile = xhr.response;
            var title = responseFile.head.getElementsByTagName('title')[0];
            title = title.innerText.toLowerCase().replace(/[^\d\.v]+/ig, '');

            githubBtnText.innerText = title;

            return response;
        }
    };

    xhr.responseType = 'document';
    xhr.open('GET', 'https://github.com/AstudilloJuanF/sharerbox/releases/latest');
    xhr.setRequestHeader('Accept', 'text/html');
    xhr.send();
});
*/


var checkArray = document.getElementsByClassName('social-network-check');
var checkAll = document.getElementById('check-all');
var uncheckAll = document.getElementById('uncheck-all');
var behaviorRadioInput = document.getElementsByClassName('behavior-radio-check');
var positionRadioInput = document.getElementsByClassName('position-radio-check');
var visibilityRadioInput = document.getElementsByClassName('visibility-radio-check');
var colorInput = document.getElementById('color-picker-input');
var buttonsSizeInput = document.getElementById('buttons-size-input');

var submit = document.getElementById('submit-button');

var toggableCodeWrapper = document.getElementById('toggable-code-wrapper');
var toggleCodeButton = document.getElementById('toggle-code-button');

function toggleCodeSnippet(e){

    var codeSnippet = toggableCodeWrapper.firstElementChild;
    var copyCodeSnippetBtn = toggableCodeWrapper.lastElementChild;

    if (toggableCodeWrapper.style.height < '1px') {

        toggableCodeWrapper.style.height = '250px';
        codeSnippet.style.height = 'fit-content';
        codeSnippet.style.height = `${codeSnippet.offsetHeight}px`;
        toggableCodeWrapper.style.height = `${codeSnippet.offsetHeight + copyCodeSnippetBtn.offsetHeight + 16 + 2 +16}px`;
        setTimeout(function(){
            toggableCodeWrapper.style.height = 'fit-content'
        }, 250);

        e.target.value = 'Hide Code';
    } else {
        toggableCodeWrapper.style.height = `${codeSnippet.offsetHeight + copyCodeSnippetBtn.offsetHeight + 16 + 2 +16}px`;
        codeSnippet.style.height = `${codeSnippet.offsetHeight}px`;
        setTimeout(function(){
            toggableCodeWrapper.removeAttribute('style');
            codeSnippet.style.height = '0px';
        }, 10);

        e.target.value = 'View Code';
    }
}

toggleCodeButton.addEventListener('click', toggleCodeSnippet);

function copyCodeSnippet(){

    var copyCodeSnippetBtn = toggableCodeWrapper.lastElementChild;

    navigator.clipboard.writeText(toggableCodeWrapper.firstElementChild.innerText);
    copyCodeSnippetBtn.innerText = 'Copied!'
}

function toggleAll(e){

    if(e.target === checkAll && checkAll.checked){
        for(var i = 0; i < checkArray.length; i++){
            checkArray[i].checked = true;
        };
        checkAll.checked = true;
        uncheckAll.checked = false;
    }else if(e.target === checkAll && !checkAll.checked && !uncheckAll.cheked){
        checkAll.checked = true;
    }
    
    if(e.target === uncheckAll && uncheckAll.checked){
        for(var i = 0; i < checkArray.length; i++){
            checkArray[i].checked = false;
        };
        uncheckAll.checked = true;
        checkAll.checked = false;
    }else if(e.target === uncheckAll && !uncheckAll.checked && !checkAll.checked){
        uncheckAll.checked = true;
    }
}

checkAll.addEventListener('click', toggleAll);
uncheckAll.addEventListener('click', toggleAll);

for(var i = 0; i < checkArray.length; i++){
        checkArray[i].addEventListener('input', syncCheckbox);
}

function syncCheckbox(){

    var checkedBoxesCount = 0;

    for(var i = 0; i < checkArray.length; i++){

        if(checkArray[i].checked === false){
            checkAll.checked = false;
            checkedBoxesCount === 0 ? uncheckAll.checked = true : undefined;

        }else{
            checkedBoxesCount++;
            checkedBoxesCount === checkArray.length ? checkAll.checked = true : undefined;
            uncheckAll.checked = false;
        }
    }
}

submit.addEventListener('click', customizeSharerbox);

function customizeSharerbox(){

    var sNetworksList = '';
    var behavior;
    var position;
    var visibility;
    var color = colorInput.value;
    var buttonsIconsize = buttonsSizeInput.value;

    for(var i = 0; i < checkArray.length; i++){
        checkArray[i].checked ? sNetworksList = sNetworksList.concat(`${checkArray[i].value} `) : undefined;
    }

    for(var i = 0; i < 2; i++){
        behaviorRadioInput[i].checked ? behavior = behaviorRadioInput[i].value : undefined;
        positionRadioInput[i].checked ? position = positionRadioInput[i].value : undefined;
        visibilityRadioInput[i].checked ? visibility = visibilityRadioInput[i].value : undefined;
    }
    sharerboxIcons(sNetworksList, buttonsIconsize);
    sharerSetup(behavior, position, color, visibility);

    toggableCodeWrapper.innerHTML = `<pre class="code-snippet">
&lt;<span class="html-tag">script</span>&gt;
	<span class="method">window</span>.<span class="old-listener">onload</span> <span class="operator">=</span> <span class="function">function</span>(){

		<span class="code-comment">// Buttons list: 'site1, site2, site3...'</span>
		<span class="code-comment">// Buttons size: number</span>
		<span class="function-call">sharerboxIcons</span>( <span class="code-quotes">'${sNetworksList.trim()}'</span>, <span class="boolean">${buttonsIconsize}</span> );

		<span class="code-comment">// Setup arguments: Behavior, Position, Color, Visibility, Description</span>
		<span class="function-call">sharerSetup</span>( <span class="code-quotes">'${behavior}'</span>, <span class="code-quotes">'${position}'</span>, <span class="code-quotes">'${color}'</span>, <span class="code-quotes">${visibility}</span>, <span class="code-quotes">'custom message or description goes here (optional)'</span> );
	};
&lt;/<span class="html-tag">script</span>&gt;
</pre>
<button style="display: block; margin: auto; margin-right: 1rem;" onclick="copyCodeSnippet()">Copy code <b>&lt;/&gt;</b></button>`;

}
/* end of function */

var formButtonsIcons = document.getElementsByClassName('form-buttons-icon');
var formButtonsWrap = document.getElementById('form-buttons-wrap');

function displayButtonIcon(number){
    formButtonsIcons[number].removeAttribute('style');
    if(number === 0){
        formButtonsWrap.children[1].value = 'Default';
        formButtonsIcons[number].style.cssText = 'transition: linear 0.35s; opacity: 1; transform: rotate(360deg)';
        setTimeout(function(){formButtonsIcons[number].style.transitionDuration = '0.1s';}, 1000);
        setTimeout(function(){formButtonsWrap.children[1].value = 'Reset'}, 2000);
    }else if(number === 1){
        formButtonsWrap.children[2].value = 'Applied';
        formButtonsIcons[number].style.cssText = 'transition: linear 0.1s; opacity: 1;';
        setTimeout(function(){formButtonsWrap.children[2].value = 'Apply'}, 2000);
    }
    setTimeout(function(){formButtonsIcons[number].style.opacity = '0';}, 2000);
    setTimeout(function(){formButtonsIcons[number].removeAttribute('style')}, 2500);

    number === 1 ? toggleCodeButton.style.display = 'block' : undefined;
}

formButtonsWrap.children[1].onclick = function(){displayButtonIcon(0)};
formButtonsWrap.children[2].onclick = function(){displayButtonIcon(1)};