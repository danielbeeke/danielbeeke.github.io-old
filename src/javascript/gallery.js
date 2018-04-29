import OneTransitionEnd from './OneTransitionEnd.js';

export default class Gallery {
  constructor (galleryItems, clickedItem) {
    let items = [];

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

      gallery.listen('initialZoomOut', function() {
        let index = gallery.getCurrentIndex();
        let galleryItem = Array.from(galleryItems)[index];

        galleryItem.parentNode.classList.add('active');
        galleryItem.parentNode.classList.add('hidden');
        galleryItem.parentNode.style.zIndex = 9000;
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