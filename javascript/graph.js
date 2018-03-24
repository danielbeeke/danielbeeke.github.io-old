export default class Graph {
  constructor (selector, data, firstYear) {
    this.element = document.querySelector(selector);
    this.data = data;
    this.years = {
      first: firstYear,
      last: new Date().getFullYear()
    };
    this.createMarkup();
    this.displayYears();
  }

  createMarkup () {
    this.rowsWrapper = document.createElement('div');
    this.rowsWrapper.classList.add('graph-rows');

    this.data.forEach((row) => {
      row.element = document.createElement('div');
      row.element.classList.add('graph-row');
      row.element.innerHTML = row.label;
      this.rowsWrapper.appendChild(row.element);
    });

    this.element.appendChild(this.rowsWrapper);

    this.gridYears = document.createElement('div');
    this.gridYears.classList.add('graph-grid');
    this.gridYears.classList.add('years');

    for (let year = this.years.first; year < this.years.last + 1; year++) {
      let yearElement = document.createElement('div');
      yearElement.classList.add('graph-label-column');
      yearElement.innerHTML = `<span class="graph-label-column-text">${year}</span>`;
      this.gridYears.appendChild(yearElement);
    }

    this.element.appendChild(this.gridYears);

    this.gridNiveaus = document.createElement('div');
    this.gridNiveaus.classList.add('graph-grid');
    this.gridNiveaus.classList.add('niveaus');

    for (let niveau = 1; niveau < 11; niveau++) {
      let niveauElement = document.createElement('div');
      niveauElement.classList.add('graph-label-column');
      niveauElement.innerHTML = `<span class="graph-label-column-text">${niveau}</span>`;
      this.gridNiveaus.appendChild(niveauElement);
    }

    this.element.appendChild(this.gridNiveaus);
  }

  displayYears () {
    let graphFrom = this.years.first;
    let graphTill = this.years.last;

    this.data.forEach((row) => {
      let rowFrom = row.years.from;
      let rowTill = row.years.till === 'now' ? (new Date().getFullYear()) + (1 / 12 * (new Date().getMonth() + 1)) : row.years.till;

      let oneYear = 100 / (graphTill - graphFrom + 1);

      let left = oneYear * (rowFrom - graphFrom);
      let width = oneYear * (rowTill - rowFrom);

      row.element.style = `left: ${left}%; width: ${width}%;`;
    })

    document.body.dataset.activeGrid = 'years';
    document.querySelector('.toggle.niveaus').classList.remove('active');
    document.querySelector('.toggle.years').classList.add('active');
  }

  displayNiveaus () {
    let graphFrom = 1;
    let graphTill = 10;

    this.data.forEach((row) => {
      let rowFrom = 1;
      let rowTill = row.rating;

      let oneYear = 100 / graphTill;

      let left = oneYear * (rowFrom - graphFrom);
      let width = oneYear * (rowTill - rowFrom);

      row.element.style = `left: ${left}%; width: ${width}%;`;
    })

    document.body.dataset.activeGrid = 'niveaus';
    document.querySelector('.toggle.years').classList.remove('active');
    document.querySelector('.toggle.niveaus').classList.add('active');
  }


}
