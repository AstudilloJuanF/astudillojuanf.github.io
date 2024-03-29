// Dynamic download button

var githubBtnText = document.getElementById('github-btn-sharerbox-version-text');

window.addEventListener('load', function() {

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.status === 200 && xhr.readyState === 4) {
            var title = xhr.response;
            title = new DOMParser().parseFromString(title, 'text/html');
            title = title.getElementById('sharerbox-semantic-version-number').innerText;
            title = `Latest: v${title.replace(/[a-z:\- ]*/ig, '')}`;

            githubBtnText.innerText = title;
        }
    };

    xhr.responseType = 'text';
    xhr.open('GET', 'https://raw.githubusercontent.com/AstudilloJuanF/sharerbox/main/README.md');
    xhr.setRequestHeader('Accept', 'text/markdown');
    xhr.send();
});


// Variables & functions for SharerBox's online preview options

var checkArray = document.getElementsByClassName('social-network-check');
var checkAll = document.getElementById('check-all');
var uncheckAll = document.getElementById('uncheck-all');
var behaviorRadioInput = document.getElementsByClassName('behavior-radio-check');
var positionRadioInput = document.getElementsByClassName('position-radio-check');
var visibilityRadioInput = document.getElementsByClassName('visibility-radio-check');
var colorInput = document.getElementById('color-picker-input');
var iconSizeInput = document.getElementById('icon-size-input');
var defaultIconSizeBtn = document.getElementById('default-icon-size-button');
var submit = document.getElementById('submit-button');
var toggableCodeWrap = document.getElementById('toggable-code-wrapper');
var toggleCodeButton = document.getElementById('toggle-code-button');

defaultIconSizeBtn.addEventListener('click', ()=> {
    iconSizeInput.value = iconSizeInput.defaultValue;
});

function toggleCodeSnippet(e) {

    var codeSnippet = toggableCodeWrap.firstElementChild;
    var copyCodeSnippetBtn = toggableCodeWrap.lastElementChild;

    if (toggableCodeWrap.style.height < '1px') {

        var cssHeightRule = 'fit-content';
        navigator.vendor === '' ? cssHeightRule = '-moz-fit-content' : undefined;

        toggableCodeWrap.style.height = '250px';
        codeSnippet.style.height = cssHeightRule;
        codeSnippet.style.height = `${codeSnippet.offsetHeight}px`;
        toggableCodeWrap.style.height = `${codeSnippet.offsetHeight + copyCodeSnippetBtn.offsetHeight + 16 + 2 +16}px`;
        setTimeout(function() {
            toggableCodeWrap.style.height = 'fit-content';
            toggableCodeWrap.style.overflow = 'unset';
        }, 250);

        e.target.value = 'Hide Code';
    } else {
        toggableCodeWrap.style.height = `${codeSnippet.offsetHeight + copyCodeSnippetBtn.offsetHeight + 16 + 2 +16}px`;
        codeSnippet.style.height = `${codeSnippet.offsetHeight}px`;
        setTimeout(function() {
            toggableCodeWrap.removeAttribute('style');
            codeSnippet.style.height = '0px';
        }, 10);

        e.target.value = 'View Code';
    }
}

toggleCodeButton.addEventListener('click', toggleCodeSnippet);

function copyCodeSnippet() {

    var codeElement = event.currentTarget.parentElement.querySelector('pre');
    var copyCodeSnippetBtn = event.currentTarget;

    navigator.clipboard.writeText(codeElement.innerText);

    copyCodeSnippetBtn.innerText = 'Copied!';
    setTimeout(function(){
        copyCodeSnippetBtn.innerText = copyCodeSnippetBtn.value;
    }, 5000)
}

function toggleAll(e) {

    if (e.target === checkAll && checkAll.checked) {

        for (var i = 0; i < checkArray.length; i++) {
            checkArray[i].checked = true;
        };

        checkAll.checked = true;
        uncheckAll.checked = false;

    } else if (e.target === checkAll && !checkAll.checked && !uncheckAll.cheked) {

        checkAll.checked = true;
    }
    
    if (e.target === uncheckAll && uncheckAll.checked) {

        for (var i = 0; i < checkArray.length; i++) {
            checkArray[i].checked = false;
        };

        uncheckAll.checked = true;
        checkAll.checked = false;

    } else if (e.target === uncheckAll && !uncheckAll.checked && !checkAll.checked) {

        uncheckAll.checked = true;
    }
}

checkAll.addEventListener('click', toggleAll);
uncheckAll.addEventListener('click', toggleAll);

for (var i = 0; i < checkArray.length; i++) {
        checkArray[i].addEventListener('input', syncCheckbox);
}

function syncCheckbox() {

    var checkedBoxesCount = 0;

    for (var i = 0; i < checkArray.length; i++) {

        if (checkArray[i].checked === false) {

            checkAll.checked = false;
            checkedBoxesCount === 0 ? uncheckAll.checked = true : undefined;

        } else {
            
            checkedBoxesCount++;
            checkedBoxesCount === checkArray.length ? checkAll.checked = true : undefined;
            uncheckAll.checked = false;
        }
    }
}

submit.addEventListener('click', customizeSharerbox);

function customizeSharerbox() {

    var sNetworksList = '';
    var behavior;
    var position;
    var visibility;
    var color = colorInput.value;
    var buttonsIconsize = iconSizeInput.value;

    for (var i = 0; i < checkArray.length; i++) {
        checkArray[i].checked ? sNetworksList = sNetworksList.concat(`${checkArray[i].value} `) : undefined;
    }

    sNetworksList === '' ? sNetworksList = 'none' : null;

    for (var i = 0; i < 2; i++) {
        behaviorRadioInput[i].checked ? behavior = behaviorRadioInput[i].value : undefined;
        positionRadioInput[i].checked ? position = positionRadioInput[i].value : undefined;
        visibilityRadioInput[i].checked ? visibility = visibilityRadioInput[i].value : undefined;
    }

    sharerbox({
        socialNetworks: sNetworksList,
        iconSize: buttonsIconsize,
        behavior: behavior,
        position: position,
        color: color,
        visibility: visibility,
    });

    toggableCodeWrap.innerHTML = `<pre class="code-snippet">
&lt;<span class="html-tag">script</span>&gt;
	<span class="method">window</span>.<span class="old-listener">addEventListener</span>(<span class="code-quotes">'load'</span>, <span class="function">function</span>() {

		<span class="function-call">sharerbox</span>({
            <span class="code-comment">// Icon list: 'site1, site2, site3...'</span>
		    <span class="code-comment">// Icon size: number</span>
            socialNetworks: <span class="code-quotes">'${sNetworksList.trim()}'</span>,
            iconSize: <span class="boolean">${buttonsIconsize}</span>,

		    <span class="code-comment">// Setup arguments: Behavior, Position, Color, Visibility, Description</span>
		    behavior: <span class="code-quotes">'${behavior}'</span>,
            position: <span class="code-quotes">'${position}'</span>,
            color: <span class="code-quotes">'${color}'</span>,
            visibility: <span class="code-quotes">'${visibility}'</span>,
            message: <span class="code-quotes">'custom message or description goes here (optional)'</span>
        });
	});
&lt;/<span class="html-tag">script</span>&gt;
</pre>
<button class="copy-code-button" style="display: block; margin: auto; margin-right: 1rem;" value="Copy code" onclick="copyCodeSnippet()">Copy code</button>`;

}
/* end of function */

var formButtonsIcons = document.getElementsByClassName('form-buttons-icon');
var formButtonsWrap = document.getElementById('form-buttons-wrap');
var resetButton = formButtonsWrap.children[1];

function displayButtonIcon(number) {
    
    formButtonsIcons[number].removeAttribute('style');

    if (number === 0) {

        checkAll.checked = false;
        uncheckAll.checked = false;

        colorInput.value = colorInput.defaultValue;
        iconSizeInput.value = iconSizeInput.defaultValue;

        for (var i = 0; i < checkArray.length; i++) {
            checkArray[i].defaultChecked === true ? checkArray[i].checked = true : checkArray[i].checked = false;
        }

        for (var i = 0; i < 2; i++) {
            behaviorRadioInput[i].defaultChecked === true ? behaviorRadioInput[i].checked = true : undefined;
            positionRadioInput[i].defaultChecked === true ? positionRadioInput[i].checked = true : undefined;
            visibilityRadioInput[i].defaultChecked === true ? visibilityRadioInput[i].checked = true : undefined;
        }

        formButtonsWrap.children[1].value = 'Default';
        formButtonsIcons[number].style.cssText = 'transition: linear 0.35s; opacity: 1; transform: rotate(360deg)';
        
        setTimeout(function() {
            formButtonsIcons[number].style.transitionDuration = '0.1s';
        }, 1000);
        setTimeout(function() {
            formButtonsWrap.children[1].value = 'Reset';
        }, 2000);

    } else if (number === 1) {

        formButtonsWrap.children[2].value = 'Applied';
        formButtonsIcons[number].style.cssText = 'transition: linear 0.1s; opacity: 1;';
        setTimeout(function() {formButtonsWrap.children[2].value = 'Apply'}, 2000);
    }

    setTimeout(function() {
        formButtonsIcons[number].style.opacity = '0';
    }, 2000);
    setTimeout(function() {
        formButtonsIcons[number].removeAttribute('style');
    }, 2500);

    number === 1 ? toggleCodeButton.style.display = 'block' : undefined;
}

formButtonsWrap.children[1].onclick = function() {displayButtonIcon(0)};
formButtonsWrap.children[2].onclick = function() {displayButtonIcon(1)};