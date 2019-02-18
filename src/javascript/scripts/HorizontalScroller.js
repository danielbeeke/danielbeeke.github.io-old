let cardSlider = document.querySelector('.card-slider');
let fakeContent = document.querySelector('.card-slider-fake-content');
fakeContent.style.height = cardSlider.scrollWidth + 'px';

window.addEventListener('scroll', function() {
  cardSlider.scrollLeft = window.scrollY;
});