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
        let id = link.href.split('#')[1];
        let linkedContent = document.querySelector('#' + id);

        if (!linkedContent) return;

        event.preventDefault();
        let rowStyles = window.getComputedStyle(document.querySelector('.row'), null);
        let linkedContentY = window.pageYOffset + linkedContent.getBoundingClientRect().top - siteHeader.offsetHeight - parseInt(rowStyles.marginBottom) / 2;

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
