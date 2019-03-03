let cardSlider = document.querySelector('.card-slider');
let odometer = document.querySelector('.current-card-number');
let cards = [...cardSlider.querySelectorAll('.card')];

cardSlider.addEventListener('scroll', function(event) {
  cards.forEach((card) => {
    let rect = card.getBoundingClientRect();
    let addOrRemove = rect.x < window.innerWidth / 2 && rect.x + rect.width > window.innerWidth / 2 ? 'add' : 'remove';
    card.classList[addOrRemove]('center');
  });

  let currentCenterCard = cardSlider.querySelector('.card.center');

  if (currentCenterCard) {
    odometer.innerHTML = Array.from(cardSlider.children).indexOf(currentCenterCard);
  }
}, {passive: true});

var hamster = Hamster(window);

hamster.wheel(function(event, delta, deltaX, deltaY){
  if (document.body.classList.contains('has-open-about'))  {return}
  if (document.body.classList.contains('has-fullscreen-teaser-expander')) { return }

  cardSlider.scrollLeft -= delta;
});

