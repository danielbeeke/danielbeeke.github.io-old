import ScrollTo from './scroll.js';

export default class Showcases {
  constructor () {
    let showcases = document.querySelectorAll('.showcase');

    document.addEventListener('keydown', (event) => {
      if (event.keyCode == 27 && this.currentShowCase) {
        closeShowcase(this.currentShowCase, this.currentClonedShowCase);
      }
    })

    let openShowcase = (showcase) => {
      document.body.classList.add('has-expanded-showcase');
      let boundingRect = showcase.getBoundingClientRect();
      let clonedShowcase = showcase.cloneNode(true);

      this.currentShowCase = showcase;
      this.currentClonedShowCase = clonedShowcase;

      clonedShowcase.style = `
        left: ${boundingRect.left}px;
        top: ${boundingRect.top}px;
        width: ${boundingRect.width}px;
        height: ${boundingRect.height}px;
        background-image: ${showcase.style.backgroundImage}
      `;

      document.body.appendChild(clonedShowcase);

      setTimeout(() => {
        clonedShowcase.classList.add('is-sticky');

        setTimeout(() => {
          clonedShowcase.classList.add('is-fullscreen');
        }, 50)
      }, 50)

      clonedShowcase.querySelector('.zoom-in-icon').addEventListener('click', () => {
        closeShowcase(showcase, clonedShowcase);
      });
    }

    let closeShowcase = (showcase, clonedShowcase) => {
      ScrollTo(0, 300, () => {
        clonedShowcase.classList.remove('is-fullscreen');
        setTimeout(() => {
          clonedShowcase.classList.remove('is-sticky');

          setTimeout(() => {
            clonedShowcase.remove();
            document.body.classList.remove('has-expanded-showcase');

            this.currentShowCase = false;
            this.currentClonedShowCase = false;
          }, 400);

        }, 400);
      }, clonedShowcase.querySelector('.scroll-wrapper'));
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
