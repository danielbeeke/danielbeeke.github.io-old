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

let startScreenX = 0;
let startScrollX = 0;
let isMoving = false;

let lock = (event) => {
  startScreenX = event.clientX;
  startScrollX = cardSlider.scrollLeft;
  isMoving = true;
};

let move = (event) => {


  if (isMoving && event.clientX !== startScreenX) {
    document.body.classList.add('is-moving-cardslider');

    cardSlider.scrollLeft = startScrollX - (event.clientX - startScreenX);
  }
};

let detach = () => {
  startScreenX = 0;
  startScrollX = 0;
  isMoving = false;

  setTimeout(() => {
    document.body.classList.remove('is-moving-cardslider');
  }, 40)
};

cardSlider.addEventListener('mousedown', lock, false);
cardSlider.addEventListener('touchstart', lock, false);

cardSlider.addEventListener('mousemove', move, false);
cardSlider.addEventListener('touchmove', move, false);

cardSlider.addEventListener('mouseup', detach, false);
cardSlider.addEventListener('touchend', detach, false);
