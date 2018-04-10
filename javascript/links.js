import ScrollTo from './scroll.js';

export default class Links {
  constructor () {
    window.addEventListener('hashchange', (event) => {
      event.preventDefault();
    }, false);

    let links = document.querySelectorAll('a.menu-item, a.link');
    let siteHeader = document.querySelector('.site-header');
    Array.from(links).forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        let id = link.href.split('#')[1];
        let linkedContent = document.querySelector('#' + id);
        let linkedContentY = window.pageYOffset + linkedContent.getBoundingClientRect().top - siteHeader.offsetHeight - 40;

        if (link.classList.contains('menu-item')) {
          document.body.classList.remove('has-active-menu');

          setTimeout(() => {
            ScrollTo(linkedContentY, 400);
          }, 700)
        }
        else {
          ScrollTo(linkedContentY, 400);
        }
      });
    });
  }
}
