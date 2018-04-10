export default class Showcases {
  constructor () {
    let showcases = document.querySelectorAll('.showcase');

    let openShowcase = (showcase) => {
      document.body.classList.add('has-expanded-showcase');
      let boundingRect = showcase.getBoundingClientRect();
      let clonedShowcase = showcase.cloneNode(true);

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
      clonedShowcase.classList.remove('is-fullscreen');

      setTimeout(() => {
        clonedShowcase.remove();
        document.body.classList.remove('has-expanded-showcase');
      }, 400);
    }

    Array.from(showcases).forEach((showcase) => {
      showcase.addEventListener('click', (event) => {
        event.preventDefault();

        if (!showcase.classList.contains('is-fullscreen')) {
          openShowcase(showcase);
        }
      });
    });
  }
}
