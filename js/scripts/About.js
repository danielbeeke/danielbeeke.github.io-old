import ScrollTo from './ScrollTo.js';

export class About {
  
  constructor (app) {
    this.toggle = document.querySelector('.about-me-button');
    this.scroller = document.querySelector('.about-me-panel .inner');
    this.closeButton = document.querySelector('.close-button');

    this.closeButton.addEventListener('click', () => {
      this.close();
    });

    this.scroller.addEventListener('scroll', () => {
      this.authorImage = document.querySelector('.author-image');

      if (this.scroller.scrollTop === this.scroller.scrollHeight - this.scroller.offsetHeight) {
        this.scroller.classList.add('reached-bottom');
      }

      else if (this.scroller.scrollTop === 0) {
        this.scroller.classList.add('reached-top');
      }

      else {
        this.scroller.classList.remove('reached-top');
        this.scroller.classList.remove('reached-bottom');
      }
    });

    this.toggle.addEventListener('mouseover', () => {
      document.body.classList.add('has-hover-about')
    });

    this.toggle.addEventListener('mouseleave', () => {
      document.body.classList.remove('has-hover-about')
    });

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && document.body.classList.contains('has-open-about')) {
        this.close();
      }
    });

    document.body.addEventListener('click', (event) => {
      if (document.body.classList.contains('has-open-about')) {
        if (event.target === document.querySelector('.about-me-panel')) {
          this.close();
        }
      }
    });

    this.toggle.addEventListener('click', () => {
      document.body.classList.contains('has-open-about') ? this.close() : this.open();
    });

    window.addEventListener('hashchange', () => {
      if (location.hash === '#about') {
        this.open();
      }

      if (location.hash === '') {
        this.close();
      }
    });

    if (location.hash === '#about') {
      this.open();
    }
  }

  open () {
    document.body.classList.add('has-open-about');
    this.scroller.scrollTop = 1;
    this.scroller.scrollTop = 0;
    history.pushState(null, '', '#about');
  }

  close () {
    let oldScrollTop = this.scroller.scrollTop;
    ScrollTo(0, oldScrollTop / 3, this.scroller, () => {
      setTimeout(() => {
        document.body.classList.remove('has-open-about');
        history.pushState(null, '', '#');
      }, oldScrollTop ? 100 : 0);
    });
  }

}