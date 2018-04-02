import './menu.js';
import Graph from './graph.js';
import ScrollTo from './scroll.js';

let graphJson = document.querySelector('#graph-json');
let graphData = JSON.parse(graphJson.innerHTML);
let graph = new Graph('#graph', graphData, 2006);

document.querySelector('.toggle.years').addEventListener('click', () => {
  graph.displayYears();
});

document.querySelector('.toggle.niveaus').addEventListener('click', () => {
  graph.displayNiveaus();
});

document.addEventListener('scroll', () => {
  document.body.classList[window.pageYOffset ? 'add' : 'remove']('has-scrolled');
});

window.addEventListener('hashchange', (event) => {
  event.preventDefault();
}, false);

let links = document.querySelectorAll('a[href]');
let siteHeader = document.querySelector('.site-header');
Array.from(links).forEach((link) => {
  link.addEventListener('click', (event) => {
    event.preventDefault();
    let id = link.href.split('#')[1];
    let linkedContent = document.querySelector('#' + id);
    let linkedContentY = window.pageYOffset + linkedContent.getBoundingClientRect().top - siteHeader.offsetHeight - 100;

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
