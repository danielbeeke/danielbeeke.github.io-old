import { Throttle } from './Throttle.js';

export class Counter {
  constructor (app) {
    this.current = document.querySelector('.odometer.current');
    this.total = document.querySelector('.odometer.total');

    app.scroller.scroll.push(Throttle(() => {
      this.setCounters();
    }, 50));

    this.setCounters();
  }

  setCounters () {
    let showcases = [...document.querySelectorAll('.slide:not(.hidden):not(.filler)')];
    this.total.innerHTML = showcases.length - 2;

    showcases.forEach((showcase) => {
      let rect = showcase.getBoundingClientRect();
      let addOrRemove = rect.x < window.innerWidth / 2 && rect.x + rect.width > window.innerWidth / 2 ? 'add' : 'remove';
      showcase.classList[addOrRemove]('center');
    });

    let currentCenterShowcase = document.querySelector('.slide.center:not(.hidden):not(.filler)');

    if (currentCenterShowcase) {
      let index = showcases.indexOf(currentCenterShowcase);

      document.body.classList.remove('start-position');
      document.body.classList.remove('never-scrolled');
      document.body.classList.remove('end-position');

      if (index > 0 && index <= showcases.length - 2) {
        this.current.innerHTML = index;
      }
      else {
        if (index < 1) {
          document.body.classList.add('start-position');
        }

        if (index > showcases.length - 2) {
          document.body.classList.add('end-position');
        }
      }
    }
  }
}


