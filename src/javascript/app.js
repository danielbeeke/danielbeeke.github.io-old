import './scripts/HorizontalScroller.js';
import './scripts/MousePointer.js';
import './scripts/LoadHtml.js';
import './scripts/teaser-expander.js';

let aboutToggle = document.querySelector('.about-me-button');

aboutToggle.addEventListener('click', () => {
    document.body.classList.toggle('has-open-about');
});