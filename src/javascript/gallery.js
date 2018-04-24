export default class Gallery {
  constructor (galleryItems, clickedItem) {

    let items = [];

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
        let rect = Array.from(galleryItems)[index].getBoundingClientRect();
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }

    };

    let gallery = new PhotoSwipe( pswpElement, PhotoSwipeUI_Default, items, options);
    gallery.init();
  }
}