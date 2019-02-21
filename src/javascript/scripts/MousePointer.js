let mousePointer = document.querySelector('.mouse-pointer');
let cardSlider = document.querySelector('.card-slider');

window.addEventListener('mousemove',(event) => {
  mousePointer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;

  if (event.target && event.target.closest) {
    let parent = event.target.closest('[data-mouse-class]');

    if (parent) {
      document.body.dataset.mouse = parent.dataset.mouseClass;
    }
    else {
      document.body.dataset.mouse = '';
    }
  }
  else {
    document.body.dataset.mouse = '';
  }
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
      console.log('expand')
    });

    teaserExpander.addEventListener('collapse', () => {
      teaserExpander.dataset.mouseClass = 'card';
      console.log('collapse')
    });
  }

});