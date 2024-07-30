// Hide and/or remove custom noscript elements

window.addEventListener('load', () =>
{
    const CUSTOM_NOSCRIPT_ELEMENTS = document.getElementsByClassName('javascript-not-enabled');

    for (let i = CUSTOM_NOSCRIPT_ELEMENTS.length -1; i >= 0; i--)
    {
        let element = CUSTOM_NOSCRIPT_ELEMENTS[i];

        element.hidden = true;
        element.remove();
    }
});

//------------------------------------------------------------------------------------