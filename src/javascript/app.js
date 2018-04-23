import './menu.js';
import Graph from './graph.js';
import {graphData} from './graph-data.js';
import Links from './links.js';
import Showcases from './showcases.js';

let graph = new Graph('#graph', graphData, 2006);

document.addEventListener('scroll', () => {
  let graphGridOffsetTop = document.querySelector('.graph-grid-wrapper').getBoundingClientRect().top;

  document.body.classList[window.pageYOffset ? 'add' : 'remove']('has-scrolled');
  document.body.classList[graphGridOffsetTop < 90 ? 'add' : 'remove']('has-graph-sticky-header');
});

let links = new Links;
let showcases = new Showcases;

setTimeout(() => {
  document.body.classList.remove('no-transitions')  
}, 300);

if (!document.body.animate) {
  let script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://rawgit.com/web-animations/web-animations-js/master/web-animations.min.js';
  document.head.appendChild(script);
}