export class ImagesLoader {
  constructor(app) {
    this.app = app;

    let wrappers = [...document.querySelectorAll('.showcase .inner'), document.querySelector('.about-me-panel .inner')];

    wrappers.forEach(wrapper => {
      let loadImagesIfNeeded = () => {

        let images = Array.prototype.slice.call(wrapper.querySelectorAll('.lazy-load:not(.loaded)'));

        images.forEach(image => {
          if (this.elementInViewport(image)) {
            this.loadImage(image);
          }
        });
      };

      wrapper.addEventListener('scroll', loadImagesIfNeeded);
      wrapper.addEventListener('open', loadImagesIfNeeded);
    });
  }

  elementInViewport (el) {
    let rect = el.getBoundingClientRect();
    return rect.top >= -600 && rect.top <= (window.innerHeight + 600);
  }

  loadImage(element) {
    if (!element.loaded) {
      let img = new Image();

      img.onload = function () {
        element.classList.add('loaded');
        element.replaceWith(img);
        img.classList = element.classList;
      };

      img.src = element.getAttribute('src');
      element.loaded = true;
    }
  }

}