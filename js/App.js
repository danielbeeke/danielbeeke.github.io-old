import { HorizontalScrolling } from './scripts/HorizontalScrolling.js';
import { About } from './scripts/About.js';
import { Counter } from './scripts/Counter.js';
import { Showcase } from './scripts/Showcase.js';
import { MousePointer } from './scripts/MousePointer.js';
import { Filters } from './scripts/Filters.js';
import { ImagesLoader } from './scripts/ImagesLoader.js';

class App {

  constructor() {
    this.scroller = new HorizontalScrolling(this, document.querySelector('.horizontal-scroller'));
    this.about = new About(this);
    this.counter = new Counter(this);
    this.showcases = [];
    Array.from(document.querySelectorAll('.showcase')).forEach(showcase => {
        this.showcases.push(new Showcase(this, showcase));
    });
    this.mouse = new MousePointer(this);
    this.filters = new Filters(this);
    this.images = new ImagesLoader(this);

    if (this.scroller.element.scrollLeft === 0) {
      setTimeout(() => {
        document.body.classList.remove('initial-fade');

        setTimeout(function () {
          document.body.classList.remove('initial-scroll-block');
        }, 1000);

        setTimeout(function () {
          document.body.classList.remove('initial-transition');
        }, 3000);
      }, 100);
    }
    else {
      document.body.classList.remove('initial-fade');
      document.body.classList.remove('initial-scroll-block');
      document.body.classList.remove('initial-transition');

    }

  }

}

new App();