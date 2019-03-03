let mousePointer = document.querySelector('.mouse-pointer');
let cardSlider = document.querySelector('.card-slider');

window.addEventListener('mousemove',(event) => {
  let parent = false;
  mousePointer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

  if (event.target && event.target.closest) {
    parent = event.target.closest('[data-mouse-class]');
  }

  document.body.dataset.mouse = parent ? parent.dataset.mouseClass : '';
});

let clickTimeout = false;

window.addEventListener('click',(event) => {
  document.body.classList.add('is-clicking');

  if (clickTimeout) {
    clearTimeout(clickTimeout);
  }

  clickTimeout = setTimeout(() => {
    document.body.classList.remove('is-clicking');
  }, 100);
});

window.addEventListener('mousedown',(event) => {
  document.body.classList.add('is-clicking');
});

window.addEventListener('mouseup',(event) => {
  document.body.classList.remove('is-clicking');
});

let cards = [...cardSlider.querySelectorAll('.card')];

cards.forEach(card => {
  let teaserExpander = card.querySelector('teaser-expander');

  if (teaserExpander) {
    teaserExpander.addEventListener('expand', () => {
      teaserExpander.dataset.mouseClass = '';
    });

    teaserExpander.addEventListener('collapse', () => {
      teaserExpander.dataset.mouseClass = 'card';
    });
  }
});