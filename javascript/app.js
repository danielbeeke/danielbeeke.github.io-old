import './menu.js';
import Graph from './graph.js';
import {graphData} from './graph-data.js';
import Links from './links.js';

let graph = new Graph('#graph', graphData, 2006);

document.addEventListener('scroll', () => {
  let graphGridOffsetTop = document.querySelector('.graph-grid-wrapper').getBoundingClientRect().top;

  document.body.classList[window.pageYOffset ? 'add' : 'remove']('has-scrolled');
  document.body.classList[graphGridOffsetTop < 90 ? 'add' : 'remove']('has-graph-sticky-header');
});

let links = new Links;
