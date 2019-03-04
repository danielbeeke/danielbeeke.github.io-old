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

let unify = (event) => {
  return event.changedTouches ? event.changedTouches[0] : event;
};

let easeInOutQuad =  function (t) { return t<.5 ? 2*t*t : -1+(4-2*t)*t };

let lock = (event) => {
  startScreenX = unify(event).clientX;
  startScrollX = cardSlider.scrollLeft;
  isMoving = true;
};

let move = (event) => {
  event = unify(event) || window.event;

  if (isMoving && event.clientX !== startScreenX) {
    document.body.classList.add('is-moving-cardslider');

    cardSlider.scrollLeft = startScrollX - ((event.clientX - startScreenX) * 1.3);
  }
};

let moveMouse = (event) => {
  document.body.classList.add('uses-mouse');
  move(event);
};

let moveTouch = () => {
  document.body.classList.add('uses-touch');
  move(event);
};

let detach = () => {
  startScreenX = 0;
  startScrollX = 0;
  isMoving = false;

  setTimeout(() => {
    document.body.classList.remove('is-moving-cardslider');
  }, 40)
};

cardSlider.addEventListener('mousedown', lock, { passive: true});
cardSlider.addEventListener('touchstart', lock, { passive: true});

cardSlider.addEventListener('mousemove', moveMouse, { passive: true});
cardSlider.addEventListener('touchmove', moveTouch, { passive: true});

cardSlider.addEventListener('mouseup', detach, { passive: true});
cardSlider.addEventListener('touchend', detach, { passive: true});
