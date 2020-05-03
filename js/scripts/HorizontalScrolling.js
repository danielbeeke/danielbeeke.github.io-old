import { Debounce } from './Debounce.js';

export class HorizontalScrolling {

  constructor(app, element) {
    this.element = element;
    this.realScrollDiv = document.createElement('div');
    this.element.before(this.realScrollDiv);
    this.realScrollDiv.style.width = '100vw';
    this.element.style.position = 'fixed';
    this.element.style.top = 0 + 'px';
    this.isFixingHorizontal = false;
    this.isFixingVertical = false;
    this.scroll = [];
    this.setScrollWidth();

    window.addEventListener('resize', () => {
      this.setScrollWidth();
    });

    window.addEventListener('scroll', (event) => {
      if (
        document.body.classList.contains('has-fullscreen-showcase') ||
        document.body.classList.contains('has-open-about')
      ) {
        event.preventDefault();
        return;
      }
      if (!this.isFixingHorizontal) {
        this.isFixingVertical = true;
        this.element.scrollLeft = window.scrollY;
        this.isFixingVertical = false;
      }

      if (this.element.scrollLeft === this.element.scrollWidth - this.element.offsetWidth) {
        document.body.classList.add('scrolled-to-end')
      }
      else {
        document.body.classList.remove('scrolled-to-end')
      }
    });

    let restore = Debounce(() => {
      this.isFixingHorizontal = true;
      window.scrollTo(0, this.element.scrollLeft);
      this.isFixingHorizontal = false;
    }, 100);

    this.element.addEventListener('scroll', (event) => {
      if (!this.isFixingVertical) {
        restore();
      }

      if (this.scroll.length) {
        this.scroll.forEach(callback => {
          if (typeof callback === 'function') {
            callback();
          }
        })
      }
    });
  }

  setScrollWidth () {
    let doIt = () => {
      this.realScrollDiv.style.height = this.element.scrollWidth - (window.innerWidth - window.innerHeight) + 'px';
    };

    setTimeout(() => {
      doIt();
    }, 1600);

    doIt();
  }

}

