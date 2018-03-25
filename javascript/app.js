import './menu.js';
import Graph from './graph.js';

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
