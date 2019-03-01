let cardSlider = document.querySelector('.card-slider');
let fakeContent = document.querySelector('.card-slider-fake-content');
let horizontalWidth = cardSlider.scrollWidth;

fakeContent.style.height = horizontalWidth + 'px';
let odometer = document.querySelector('.current-card-number');

cardSlider.addEventListener('scroll', function(event) {
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
}, {passive: true});

var hamster = Hamster(window);

hamster.wheel(function(event, delta, deltaX, deltaY){
  if (document.body.classList.contains('has-open-about'))  {return}
  if (document.body.classList.contains('has-fullscreen-teaser-expander')) { return }

  cardSlider.scrollLeft += delta;
});

