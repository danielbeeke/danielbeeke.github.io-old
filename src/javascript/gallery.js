import OneTransitionEnd from './OneTransitionEnd.js';

export default class Gallery {
  constructor (galleryItems, clickedItem) {
    let items = [];

    let photoSwipeTemplate = `
      <div class="pswp__bg"></div>
      <div class="pswp__scroll-wrap">
          <div class="pswp__container">
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
          </div>
          <div class="pswp__ui pswp__ui--hidden">
              <div class="pswp__top-bar">
                  <div class="pswp__counter"></div>

                  <button class="pswp__button--close pswp__single-tap" title="Close (Esc)">
                      <div class="zoom-in-icon pswp__closer">
                          <div class="zoom-in-icon-part pswp__closer"></div>
                      </div>
                  </button>
                  <div class="pswp__preloader">
                      <div class="pswp__preloader__icn">
                          <div class="pswp__preloader__cut">
                              <div class="pswp__preloader__donut"></div>
                          </div>
                      </div>
                  </div>
              </div>

              <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                  <div class="pswp__share-tooltip"></div>
              </div>

              <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">
              </button>

              <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">
              </button>

              <div class="pswp__caption">
                  <div class="pswp__caption__center"></div>
              </div>
          </div>
      </div>`;

    if (!document.querySelector('.pswp')) {
      let pswpWrapper = document.createElement('div');
      pswpWrapper.classList.add('pswp');
      pswpWrapper.tabIndex = -1;
      pswpWrapper.setAttribute('role', 'dialog');
      pswpWrapper.setAttribute('aria-hidden', true);
      pswpWrapper.innerHTML = photoSwipeTemplate;
      document.body.appendChild(pswpWrapper);
    }

    clickedItem.parentNode.style.zIndex = 9000;
    clickedItem.parentNode.classList.add('transitions');

    document.body.classList.add('has-case-gallery-item-fullscreen');

    OneTransitionEnd(clickedItem.parentNode, 'clip-path', 'active').then(() => {
      galleryItems.forEach((galleryItem) => {
        let width = window.innerWidth * 2;
        let widthFactor = width / galleryItem.clientWidth;
        let height = galleryItem.clientHeight * widthFactor;

        items.push({
          msrc: galleryItem.src,
          src: galleryItem.src.replace('/thumbs', ''),
          w: width,
          h: height
        });
      });

      let pswpElement = document.querySelector('.pswp');

      let options = {
        index: Array.from(galleryItems).indexOf(clickedItem),
        preload: [2, 2],
        history: false,
        tapToToggleControls: true,
        closeElClasses: ['closer'],
        tapToClose: true,
        loadingIndicatorDelay: 0,
        getThumbBoundsFn: function(index) {
          let pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
          let galleryItem = Array.from(galleryItems)[index];
          let rect = galleryItem.getBoundingClientRect();
          return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
        }
      };

      let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);

      gallery.listen('initialZoomIn', function() {
        clickedItem.parentNode.classList.remove('transitions');
        clickedItem.parentNode.classList.add('hidden');
        clickedItem.parentNode.style.zIndex = 'auto';
      });

      gallery.listen('initialZoomInEnd', function() {
        clickedItem.parentNode.classList.remove('hidden');
        clickedItem.parentNode.classList.remove('active');
      });

      let zoomOut = function() {
        let index = gallery.getCurrentIndex();
        let galleryItem = Array.from(galleryItems)[index];

        galleryItem.parentNode.classList.add('active');
        galleryItem.parentNode.classList.add('hidden');
        galleryItem.parentNode.style.zIndex = 9000;
      };

      gallery.listen('preventDragEvent', zoomOut)

      gallery.listen('initialZoomOut', zoomOut);

      gallery.listen('beforeChange', () => {
        Array.from(galleryItems).forEach((galleryItem) => {
          galleryItem.parentNode.classList.remove('active');
          galleryItem.parentNode.classList.remove('hidden');
          galleryItem.parentNode.style.zIndex = '';            
        })
      });

      gallery.listen('destroy', function () {
        let index = gallery.getCurrentIndex();
        let galleryItem = Array.from(galleryItems)[index];

        galleryItem.parentNode.classList.remove('hidden');
        galleryItem.parentNode.classList.add('transitions');

        setTimeout(() => {
          OneTransitionEnd(galleryItem.parentNode, 'clip-path', 'active', 'remove').then(() => {
            galleryItem.parentNode.style.zIndex = 'auto';
            galleryItem.parentNode.classList.remove('transitions');
            document.body.classList.remove('has-case-gallery-item-fullscreen');
          });
        }, 100);
      });

      gallery.init();
    });
  }
}