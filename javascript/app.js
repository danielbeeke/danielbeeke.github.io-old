import './menu.js';
import Graph from './graph.js';
import {graphData} from './graph-data.js';
import Links from './links.js';

let graph = new Graph('#graph', graphData, 2006);

document.addEventListener('scroll', () => {
  document.body.classList[window.pageYOffset ? 'add' : 'remove']('has-scrolled');
});

let links = new Links;
