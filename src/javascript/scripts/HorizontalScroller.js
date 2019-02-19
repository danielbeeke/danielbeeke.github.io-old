let cardSlider = document.querySelector('.card-slider');
let fakeContent = document.querySelector('.card-slider-fake-content');
fakeContent.style.height = (cardSlider.scrollWidth - 300) + 'px';

window.addEventListener('scroll', function() {
  cardSlider.scrollLeft = window.scrollY;
});

const intersectionObserver = new IntersectionObserver((entries, observer) => {
  entries.forEach((entry) => {
    if (entry.intersectionRatio > 0) {
      entry.target.classList.add('in-viewport');
    }
    else {
      entry.target.classList.remove('in-viewport');
    }
  });
});

const elements = [...document.querySelectorAll('.card')];

elements.forEach((element) => intersectionObserver.observe(element));

window.addEventListener('mousewheel', function(e) {
  if (e.deltaX) {
    e.preventDefault();
    window.scrollTo(0, window.scrollY + e.deltaY)
  }
});