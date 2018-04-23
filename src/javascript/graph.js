export default class Graph {

  // Start the graph.
  constructor (selector, data, firstYear) {
    this.data = data;
    this.element = document.querySelector(selector);
    this.years = {
      first: firstYear,
      last: new Date().getFullYear()
    };

    this.aggregateGroups();
    this.createHeader();
    this.createGrid();
    this.attachEventListeners();
    this.createMarkup();

    let displayMode = localStorage.getItem('showGraph') || 'Years';
    this['display' + displayMode]();
  }

  // Creates the data from which we draw the graph.
  aggregateGroups () {
    let groupDefaults = {
      rows: [],
      yearsFrom: new Date().getFullYear(),
      yearsTill: this.years.last,
      rating: 0
    };

    this.groups = new Map(
      this.data
      .filter(row => row.group)
      .map(row => [
        row.group,
        Object.assign({}, groupDefaults)
      ])
    );

    Array.from(this.groups).forEach(([groupName, group]) => {
      group.rows = this.data.filter(rowToFilter => rowToFilter.group === groupName);

      group.rows.forEach((row) => {
        row.yearsFrom = row.years.from;
        row.yearsTill = row.years.till;

        delete row.years;

        if (row.yearsFrom < group.yearsFrom) {
          group.yearsFrom = row.yearsFrom;
        }

        if (row.yearsTill > group.yearsTill) {
          group.yearsTill = row.yearsTill;
        }

        if (group.yearsTill === new Date().getFullYear()) {
          group.yearsTill = 'now';
        }

        if (row.rating > group.rating) group.rating = row.rating;
      });
    });
  }

  // Create the sticky headers.
  createHeader () {
    // Wrapper.
    this.headers = document.createElement('div');
    this.headers.classList.add('graph-headers-wrapper');
    this.element.appendChild(this.headers);

    // Years.
    this.headersYears = document.createElement('div');
    this.headersYears.classList.add('graph-headers');
    this.headersYears.classList.add('years');

    for (let year = this.years.first; year < this.years.last + 1; year++) {
      let yearElement = document.createElement('div');
      yearElement.classList.add('graph-headers-column');
      yearElement.innerHTML = `<span class="graph-header-label">'${year.toString().substr(2)}</span>`;
      this.headersYears.appendChild(yearElement);
    }

    this.headers.appendChild(this.headersYears);

    // Niveaus.
    this.headersNiveaus = document.createElement('div');
    this.headersNiveaus.classList.add('graph-headers');
    this.headersNiveaus.classList.add('niveaus');

    for (let niveau = 1; niveau < 11; niveau++) {
      let niveauElement = document.createElement('div');
      niveauElement.classList.add('graph-headers-column');
      niveauElement.innerHTML = `<span class="graph-header-label">${niveau}</span>`;
      this.headersNiveaus.appendChild(niveauElement);
    }

    this.headers.appendChild(this.headersNiveaus);
  }

  // Create the background-grid.
  createGrid () {
    // Wrapper.
    this.grid = document.createElement('div');
    this.grid.classList.add('graph-grid-wrapper');
    this.element.appendChild(this.grid);

    // Years.
    this.gridYears = document.createElement('div');
    this.gridYears.classList.add('graph-grid');
    this.gridYears.classList.add('years');

    for (let year = this.years.first; year < this.years.last + 1; year++) {
      let yearElement = document.createElement('div');
      yearElement.classList.add('graph-grid-column');
      this.gridYears.appendChild(yearElement);
    }

    this.grid.appendChild(this.gridYears);

    // Niveaus.
    this.gridNiveaus = document.createElement('div');
    this.gridNiveaus.classList.add('graph-grid');
    this.gridNiveaus.classList.add('niveaus');

    for (let niveau = 1; niveau < 11; niveau++) {
      let niveauElement = document.createElement('div');
      niveauElement.classList.add('graph-grid-column');
      this.gridNiveaus.appendChild(niveauElement);
    }

    this.grid.appendChild(this.gridNiveaus);
  }

  // Control events.
  attachEventListeners () {
    document.querySelector('.toggle.years').addEventListener('click', () => {
      this.displayYears();
    });

    document.querySelector('.toggle.niveaus').addEventListener('click', () => {
      this.displayNiveaus();
    });
  }

  // Create rows.
  createMarkup () {
    this.rowsWrapper = document.createElement('div');
    this.rowsWrapper.classList.add('graph-rows');

    Array.from(this.groups).forEach(([groupName, group]) => {
      group.element = document.createElement('div');
      group.element.classList.add('graph-row');
      group.element.classList.add('group');
      group.element.innerHTML =  `<span class="graph-row-label">${groupName}</span><div class="graph-row-toggle"></div>`;
      this.rowsWrapper.appendChild(group.element);

      group.element.addEventListener('click', () => {
        group.element.classList.toggle('expanded');
        group.rows.forEach((row) => {
          row.element.classList.toggle('expanded');
        });
      });

      group.rows.forEach((row) => {
        row.element = document.createElement('div');
        row.element.classList.add('graph-row');
        row.element.innerHTML =  `<span class="graph-row-label">${row.label}</span>`;
        this.rowsWrapper.appendChild(row.element);
      });
    });

    this.element.appendChild(this.rowsWrapper);
  }

  // Switch to year display.
  displayYears () {
    localStorage.setItem('showGraph', 'Years');
    let graphFrom = this.years.first;
    let graphTill = this.years.last;

    let setRow = (row) => {
      let rowFrom = row.yearsFrom;
      let rowTill = row.yearsTill === 'now' ? (new Date().getFullYear()) + (1 / 12 * (new Date().getMonth() + 1)) : row.yearsTill;

      let oneYear = 100 / (graphTill - graphFrom + 1);

      let left = oneYear * (rowFrom - graphFrom);
      let width = oneYear * (rowTill - rowFrom);

      row.element.style.left = left + '%';
      row.element.style.width = width + '%';
    }

    Array.from(this.groups).forEach(([groupName, group]) => {
      setRow(group);
      group.rows.forEach((row) => {
        setRow(row)
      });
    });

    document.body.dataset.activeGrid = 'years';
    document.querySelector('.toggle.niveaus').classList.remove('active');
    document.querySelector('.toggle.years').classList.add('active');
  }

  // Switch to niveau display.
  displayNiveaus () {
    localStorage.setItem('showGraph', 'Niveaus');
    let graphFrom = 1;
    let graphTill = 10;

    let setRow = (row) => {
      let rowFrom = 1;
      let rowTill = row.rating;

      let oneYear = 100 / graphTill;

      let left = oneYear * (rowFrom - graphFrom);
      let width = oneYear * (rowTill - rowFrom);

      row.element.style.left = left + '%';
      row.element.style.width = width + '%';
    };

    Array.from(this.groups).forEach(([groupName, group]) => {
      setRow(group);
      group.rows.forEach((row) => {
        setRow(row)
      });
    });

    document.body.dataset.activeGrid = 'niveaus';
    document.querySelector('.toggle.years').classList.remove('active');
    document.querySelector('.toggle.niveaus').classList.add('active');
  }
}
