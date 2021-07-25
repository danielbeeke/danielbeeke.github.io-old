import './oneTransitionEnd.js';
import ScrollTo from './ScrollTo.js';

export class Showcase {
  constructor (app, element) {
    this.speed = 400;
    this.easing = 'cubic-bezier(.2,.1,.65,.95)';
    this.element = element;
    this.popup = element.querySelector('.popup');
    this.inner = element.querySelector('.inner');
    this.background = element.querySelector('.background');
    this.expanded = false;
    this.closeButton = element.querySelector('.close-button');

    this.closeButton.addEventListener('click', (event) => {
      if (this.expanded === true && !this.busy) {
        this.close();
      }

      event.stopPropagation();
    });

    element.addEventListener('click', (event) => {
      if (this.expanded === false && !this.busy) {
        this.open()
      }
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && this.expanded) {
        window.requestAnimationFrame(() => {
          this.close();
        });
      }
    });

    let openOnMatchingHash = () => {
      if (location.hash.replace('#/', '#').substr(1) === this.element.dataset.popupId && !this.element.classList.contains('hidden')) {
        this.open();
      }
    };

    window.addEventListener('hashchange', () => {
      if (location.hash === '') {
        this.close();
      }

      openOnMatchingHash();
    });

    openOnMatchingHash();
  }

  open () {
    if (this.background.dataset.big) {
      let img = new Image();

      img.onload = () => {
        this.background.style.backgroundImage = 'url(' + this.background.dataset.big + ')';
        delete this.background.dataset.big;
      };

      img.src = this.background.dataset.big;
    }

    this.inner.dispatchEvent(new CustomEvent('open'));

    this.busy = true;
    this.element.classList.add('active');
    this.expanded = true;
    document.body.classList.add('has-fullscreen-showcase');
    this.rect = this.popup.getBoundingClientRect();
    this.popup.style.position = 'fixed';
    this.element.style.zIndex = 100;
    this.element.style.opacity = 1;
    this.popup.style.zIndex = 100;
    this.element.dataset.mouseClass = '';
    this.applyUrl(true);

    this.popup.style.left = this.rect.left + 'px';
    this.popup.style.top = this.rect.top + 'px';
    this.popup.style.width = this.rect.width + 'px';
    this.popup.style.height = this.rect.height + 'px';

    this.outerAnimation = this.popup.animate({
      'width': [ this.rect.width + 'px', `calc(100vw)` ],
      'height': [ this.rect.height + 'px', `calc(100vh)` ],
      'left': [ this.rect.left + 'px', `calc(50vw)` ],
      'top': [ this.rect.top + 'px', `calc(50vh)` ],
      'transform': [ 'translate(0, 0)', 'translate(-50%, -50%)' ],
    }, {
      duration: this.speed,
      fill: 'forwards',
      easing: this.easing
    });

    this.outerAnimation.finished.then(() => {

      this.element.classList.add('expanded');

      this.innerAnimation = this.inner.animate({
        opacity: [0, 1],
        transform: ['translateY(-10px)', 'translateY(0)']
      }, {
        duration: 500,
        fill: 'forwards',
        easing: this.easing
      });

      this.innerAnimation.finished.then(() => {
        this.busy = false;
      });
    });
  }

  close () {
    this.busy = true;
    this.expanded = false;

    ScrollTo(0, this.inner.scrollTop / 4, this.inner, () => {
      this.element.classList.remove('expanded');
      this.element.dispatchEvent(new CustomEvent('collapse'));
      this.innerAnimation.reverse();
      this.innerAnimation.finished.then(() => {
        this.outerAnimation.reverse();
        this.outerAnimation.finished.then(() => {
          document.documentElement.style.overflowY = '';
          let background = this.popup.style.backgroundImage;
          this.popup.setAttribute('style', '');
          this.popup.style.backgroundImage = background;
          this.element.dataset.mouseClass = 'plus';
          this.element.style.zIndex = 1;
          this.element.style.opacity = '';
          document.body.classList.remove('has-fullscreen-showcase');
          this.busy = false;
          this.element.classList.remove('active');
          this.applyUrl(false);
        });
      });
    });
  }

  applyUrl (addUrl) {
    history.pushState(null, '', addUrl ? '#/' + this.element.dataset.popupId : '#');
  }

}