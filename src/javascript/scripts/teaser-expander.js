import './oneTransitionEnd.js';
import ScrollTo from './ScrollTo.js';

let template = `<div class="teaser-expander-backdrop"></div>
<div class="teaser-expander-inner">
  <div class="teaser-expander-header">
    <slot name="header"></slot>    
  </div>
  <div class="teaser-expander-content">
    <slot name="content"></slot>        
  </div>
</div>`;

let css = (depth = 0, inset = 20) => {
  return `
  :host {
    position: relative;
    display: block;
    user-select: none;
    z-index: 1;
    transition: box-shadow .4s ease-in-out;
    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  
  :host:after {
    // transition: all .4s ease-in-out;
    pointer-events: none;
    content: '';
    display: block;
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    z-index: -1;
    background-color: black;
    opacity: 0;
  }

  .teaser-expander-inner {
    display: block;
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    height: 100%;
    width: 100%;
    // transition: all .4s cubic-bezier(.2,.1,.65,.95);
    box-sizing: border-box;
    overflow: hidden;
  }
  
  :host(:not([expanded]):focus) {
    box-shadow: 0 0 0 7px rgba(0, 0, 0, .3);
  }
  
  :host([busy]) {
    pointer-events: none;
  }
  
  .teaser-expander-backdrop {
    background: black;
    position: fixed;
    top: 0;
    left: 0;
    opacity: 0;
    pointer-events: none;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
  
  .teaser-expander-content {
    // transition: all .4s ease-in-out;
    opacity: 0;
    width: 100%;
    height: calc(100%);
    box-sizing: border-box;
  }
  
  :host(.expanded):after {
    opacity: .8;
    transition-delay: .1s;
  }
  
  :host(.expanded) .teaser-expander-inner {
    width: calc(100vw - ${depth * inset * 2}px) !important;
    height: calc(100vh - ${depth * inset * 2}px) !important;
    left: calc(50vw - ${(depth - 1) * inset}px) !important;
    top: calc(50vh - ${(depth - 1) * inset}px) !important;
    transform: translate(-50%, -50%) !important;
  }
  
  :host(.content-visible) .teaser-expander-content {
    opacity: 1;
    transition-delay: .6s;
  }`;
};

customElements.define('teaser-expander', class TeaserExpander extends HTMLElement {

  static get observedAttributes() { return ['expanded']; }

  constructor () {
    super();
    this.inset = window.innerWidth > 500 ? 40 : 0;
    this.rect = false;
    this.innerAnimation = false;
    this.outerAnimation = false;
    this.speed = 300;
    this.depth = this.getDepth();
    this.easing = 'cubic-bezier(.2,.1,.65,.95)';
    this.attachShadow({mode: 'open'}).innerHTML = template + '<style>' + css(this.depth, this.inset) + '</style>';
    this.inner = this.shadowRoot.querySelector('.teaser-expander-inner');
    this.header = this.shadowRoot.querySelector('.teaser-expander-header');
    this.content = this.shadowRoot.querySelector('.teaser-expander-content');
    this.backdrop = this.shadowRoot.querySelector('.teaser-expander-backdrop');
    this.attachEvents();
    this.busy = false;

    if (!window.teaserExpanders) {
      window.teaserExpanders = [];
    }

    document.addEventListener('keyup', (event) => {
      if (event.key === 'Escape' && this.expanded) {
        window.requestAnimationFrame(() => {
          let lastOpened = window.teaserExpanders[window.teaserExpanders.length - 1];
          lastOpened.expanded = false;
        });
      }
    });
  }

  getDepth () {
    let parent = this.parentElement;
    let counter = 0;

    while (parent) {
      if (parent.nodeName === 'TEASER-EXPANDER') {
        counter++;
      }

      if (parent) {
        parent = parent.parentElement;
      }
    }

    return counter + 1;
  }

  attachEvents () {
    this.addEventListener('click', (event) => {
      if (!this.expanded && !this.busy && !document.body.classList.contains('is-moving-cardslider')) {
        this.expanded = true;
      }
    });

    this.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !this.expanded && !this.busy) {
        this.expanded = true;
      }
    });
  }

  attributeChangedCallback(name) {
    if (name === 'expanded') {

      /**
       * Expand
       */
      if (this.expanded) {
        this.busy = true;
        this.dispatchEvent(new CustomEvent('expand'));
        window.teaserExpanders.push(this);
        this.applyUrl();
        document.body.classList.add('has-fullscreen-teaser-expander');
        this.rect = this.inner.getBoundingClientRect();
        this.inner.style.position = 'fixed';
        this.style.zIndex = 100;
        this.backdropAnimation = this.backdrop.animate({
          'opacity': ['0', '1']
        }, {
          duration: 180,
          fill: 'forwards',
        });

        this.outerAnimation = this.inner.animate({
          'width': [ this.rect.width + 'px', `calc(100vw - ${this.depth * this.inset * 2}px)` ],
          'height': [ this.rect.height + 'px', `calc(100vh - ${this.depth * this.inset * 2}px)` ],
          'left': [ this.rect.left + 'px', `calc(50vw - ${(this.depth - 1) * this.inset}px)` ],
          'top': [ this.rect.top + 'px', `calc(50vh - ${(this.depth - 1) * this.inset}px)` ],
          'transform': [ 'translate(0, 0)', 'translate(-50%, -50%)' ],
          'overflow': ['hidden', 'auto'],
        }, {
          duration: this.speed,
          fill: 'forwards',
          easing: this.easing
        });

        this.backdropAnimation.finished.then(() => {
          this.innerAnimation = this.content.animate({
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

      /**
       * Collapse
       */
      else {
        this.busy = true;
        this.dispatchEvent(new CustomEvent('collapse'));
        let card = this.content.children[0].assignedNodes()[0];
        ScrollTo(0, 500, card, () => {
          this.innerAnimation.reverse();
          this.innerAnimation.finished.then(() => {
            this.backdropAnimation.reverse();
            this.outerAnimation.reverse();
            this.outerAnimation.finished.then(() => {
              document.documentElement.style.overflowY = '';
              this.inner.style.position = 'absolute';
              this.style.zIndex = 1;
              document.body.classList.remove('has-fullscreen-teaser-expander');
              this.busy = false;
              window.teaserExpanders.splice(window.teaserExpanders.length - 1)
              this.applyUrl();
            });
          });

        });

      }
    }
  }

  applyUrl () {
    let url = '#';
    window.teaserExpanders.forEach((teaserExpander) => {
      url += '/' + teaserExpander.dataset.popupId;
    });

    history.pushState(null, '', url);
  }

  get expanded () {
    return this.getAttribute('expanded') !== null;
  }

  set expanded (value) {
    value ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
  }

  get busy () {
    return this.getAttribute('busy') !== null;
  }

  set busy (value) {
    value ? this.setAttribute('busy', '') : this.removeAttribute('busy');
  }

  connectedCallback() {
    this.tabIndex = 0;
    this.inner.style.backgroundImage = `url(${this.getAttribute('image')})`;

    if (location.hash.substr(2) === this.dataset.popupId) {
      this.expanded = true;
    }
  }
});