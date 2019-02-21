let cardSlider = document.querySelector('.card-slider');
let fakeContent = document.querySelector('.card-slider-fake-content');
fakeContent.style.height = (cardSlider.scrollWidth - 300) + 'px';
let odometer = document.querySelector('.current-card-number');

window.addEventListener('scroll', function() {
  cardSlider.scrollLeft = window.scrollY;

  let cards = [...cardSlider.querySelectorAll('.card')];
  cards.forEach((card) => {
    let rect = card.getBoundingClientRect();

    if (rect.x < window.innerWidth / 2 && rect.x + rect.width > window.innerWidth / 2) {
      card.classList.add('center');
    }
    else {
      card.classList.remove('center');
    }
  });

  let currentCenterCard = cardSlider.querySelector('.card.center');

  if (currentCenterCard) {
    let index = Array.from(cardSlider.children).indexOf(currentCenterCard);
    odometer.innerHTML = index;
  }
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