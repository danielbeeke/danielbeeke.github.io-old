import ScrollTo from './scroll.js';
import OneTransitionEnd from './OneTransitionEnd.js';
import Gallery from './gallery.js';

export default class Showcases {
  constructor () {
    let showcases = document.querySelectorAll('.showcase');
    this.speed = 400;

    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 27 && this.currentShowCase) {
        let pswpElement = document.querySelector('.pswp');

        if (!pswpElement.classList.contains('pswp--visible')) {
          closeShowcase(this.currentShowCase, this.currentShowCaseClone);
        }
      }
    });

    let openShowcase = (showcase) => {
      document.body.classList.add('has-expanded-showcase');
      document.body.classList.add('show-backdrop');
      let boundingRect = showcase.getBoundingClientRect();
      let showcaseClone = showcase.cloneNode(true);
      showcase.classList.add('hidden');
      let title = showcaseClone.querySelector('.title');
      let description = showcaseClone.querySelector('.description');
      this.currentShowCase = showcase;
      this.currentShowCaseClone = showcaseClone;

      showcaseClone.querySelector('.zoom-in-icon').addEventListener('click', () => {
        closeShowcase(showcase, showcaseClone);
      });

      document.body.appendChild(showcaseClone);

      let items = showcaseClone.querySelectorAll('.gallery-item');
      Array.from(items).forEach((item) => {
        item.addEventListener('click', (event) => {
          new Gallery(items, item);
        }, false);
      });

      setTimeout(() => {
        showcaseClone.classList.add('is-going-fullscreen')
      });

      showcaseClone.style.left = boundingRect.left + 'px';
      showcaseClone.style.top = boundingRect.top + 'px';
      showcaseClone.style.width = boundingRect.width + 'px';
      showcaseClone.style.height = boundingRect.height + 'px';
      showcaseClone.style.position = 'fixed';
      showcaseClone.style.zIndex = 20000;
      showcaseClone.style.cursor = 'default';
      showcaseClone.style.backgroundImage = showcase.style.backgroundImage;

      let fontSize = window.getComputedStyle(title, null).getPropertyValue('font-size');
      let fontSizeMultiplied =  parseInt(fontSize) * 2 + 'px';

      let easing = 'cubic-bezier(.37,.1,.36,.78)';

      description.animate({
        'maxWidth': [ boundingRect.width - 40 + 'px', '1080px' ]
      }, {
        duration: this.speed,
        fill: 'forwards',
        easing: easing
      });

      title.animate({
        'fontSize': [ fontSize, fontSizeMultiplied],
        'maxWidth': [ boundingRect.width - 40 + 'px', '1080px' ]
      }, {
        duration: this.speed,
        fill: 'forwards',
        easing: easing
      });

      let animation = showcaseClone.animate({
        top: [ boundingRect.top + 'px', '0px' ],
        left: [ boundingRect.left + 'px', '0px' ],
        width: [ boundingRect.width + 'px', '100vw' ],
        height: [ boundingRect.height + 'px', '102vh' ],
        borderRadius: [ '7px', 0 ],
        borderWidth: [ '3px', 0 ],
        margin: [ '2px', 0 ]
      }, {
        duration: this.speed,
        fill: 'forwards',
        easing: easing
      });

      animation.onfinish = () => {
        showcaseClone.classList.add('is-fullscreen')
      }
    };

    let closeShowcase = (showcase, showcaseClone) => {
      ScrollTo(0, 300, () => {
        let boundingRect = showcase.getBoundingClientRect();
        let easing = 'cubic-bezier(.74,.19,.72,.91)';
        let title = showcaseClone.querySelector('.title');
        let description = showcaseClone.querySelector('.description');
        let originalTitle = showcase.querySelector('.title');

        OneTransitionEnd(showcaseClone, 'opacity', 'is-fullscreen', 'remove').then(() => {
          let animation = showcaseClone.animate({
             top: [ '0px', boundingRect.top + 'px' ],
             left: [ '0px', boundingRect.left + 'px' ],
             width: [ '100vw', boundingRect.width + 'px' ],
             height: [ '102vh', boundingRect.height + 'px' ],
             borderRadius: [ 0, '7px' ],
             borderWidth: [ 0, '3px' ]
           }, {
             duration: this.speed,
             fill: 'forwards',
             easing: easing
           });

           let fontSize = window.getComputedStyle(originalTitle, null).getPropertyValue('font-size');
           let fontSizeMultiplied =  parseInt(fontSize) * 2 + 'px';

           title.animate({
             'fontSize': [ fontSizeMultiplied, fontSize ],
             'maxWidth': [ '1080px', boundingRect.width - 40 + 'px' ]
           }, {
             duration: this.speed,
             fill: 'forwards',
             easing: easing
           });

          description.animate({
            'maxWidth': [ '1080px', boundingRect.width - 40 + 'px' ]
          }, {
            duration: this.speed,
            fill: 'forwards',
            easing: easing
          });

          showcase.classList.remove('hidden');

          setTimeout(() => {
              document.body.classList.remove('show-backdrop');
          }, 200);

           animation.onfinish = () => {
             OneTransitionEnd(showcaseClone, 'opacity', 'is-going-fullscreen', 'remove').then(() => {
               showcaseClone.remove();
               document.body.classList.remove('has-expanded-showcase');
             });
           }
         });
      }, showcaseClone.querySelector('.scroll-wrapper'));
    }

    Array.from(showcases).forEach((showcase) => {
      showcase.addEventListener('click', (event) => {
        event.preventDefault();

        if (!showcase.classList.contains('is-fullscreen')) {
          let boundingRect = showcase.getBoundingClientRect();
          let siteHeader = document.querySelector('.site-header');

          if (boundingRect.top < siteHeader.clientHeight) {
            ScrollTo(window.pageYOffset + boundingRect.top - siteHeader.clientHeight - 20, 300, () => {
              openShowcase(showcase);
            });
          }
          else {
            openShowcase(showcase);
          }
        }
      });
    });
  }
}
