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
    // this.createMarkup();

    let displayMode = localStorage.getItem('showGraph') || 'Years';
    // this['display' + displayMode]();

  }

  attachEventListeners () {

    // document.querySelector('.toggle.years').addEventListener('click', () => {
    //   graph.displayYears();
    // });
    //
    // document.querySelector('.toggle.niveaus').addEventListener('click', () => {
    //   graph.displayNiveaus();
    // });

  }

  // Creates the data from which we draw the graph.
  aggregateGroups () {
    let groupDefaults = {
      rows: [],
      years: {
        from: new Date().getFullYear(),
        till: this.years.last,
      },
      rating: 0,
      visible: false
    };

    this.groups = new Map(
      this.data
      .filter(row => row.group)
      .map(row => [
        row.group,
        Object.assign({}, groupDefaults)
      ])
    );

    this.groups.forEach((group, groupName) => {
      group.rows = this.data.filter(rowToFilter => rowToFilter.group === groupName);

      group.rows.forEach((row) => {
        if (row.years.from < group.years.from) group.years.from = row.years.from;
        if (row.years.till > group.years.till) group.years.till = row.years.till;

        if (group.years.till === new Date().getFullYear()) {
          group.years.till = 'now';
        }

        if (row.rating > group.rating) group.rating = row.rating;
      });
    });
  }

  createHeader () {
    this.headers = document.createElement('div');
    this.headers.classList.add('graph-headers');
    this.element.appendChild(this.headers);

    this.headersYears = document.createElement('div');
    this.headersYears.classList.add('years');

    for (let year = this.years.first; year < this.years.last + 1; year++) {
      let yearElement = document.createElement('div');
      yearElement.classList.add('graph-headers-column');
      yearElement.innerHTML = `<span class="graph-header-label">'${year.toString().substr(2)}</span>`;
      this.headersYears.appendChild(yearElement);
    }

    this.headers.appendChild(this.headersYears);
  }

  createGroupRow (groupName) {
    this.groups[groupName] = {
      element: document.createElement('div'),
      rows: [],
      years: {},
      visible: false
    }

    let group = this.groups[groupName];
    group.element.classList.add('graph-row');
    group.element.classList.add('is-group');
    group.element.innerHTML = `<span class="graph-row-label">${groupName}<span class="graph-row-expand"></span></span>`;
    this.rowsWrapper.appendChild(group.element);

    group.element.addEventListener('click', () => {
      group.visible = !group.visible;
      group.element.classList[group.visible ? 'add' : 'remove']('is-expanded')

      group.rows.forEach((row) => {
        row.element.classList[group.visible ? 'remove' : 'add']('hidden')
      });
    });
  }

  createStandardRow (row) {
    row.element = document.createElement('div');
    row.element.classList.add('graph-row');

    if (row.group) {
      let group = this.groups[row.group];
      row.element.classList[group.visible ? 'remove' : 'add']('hidden')
      group.rows.push(row);
      row.element.dataset.group = row.group;
    }

    row.element.innerHTML =  `<span class="graph-row-label">${row.label}</span>`;
    this.rowsWrapper.appendChild(row.element);
  }

  createMarkup () {
    this.rowsWrapper = document.createElement('div');
    this.rowsWrapper.classList.add('graph-rows');

    this.createGridYears();
    this.createGridNiveaus();

    this.data.forEach((row) => {
      this.createStandardRow(row);
    });

    this.element.appendChild(this.rowsWrapper);
  }

  createGridNiveaus () {
    this.gridNiveaus = document.createElement('div');
    this.gridNiveaus.classList.add('graph-grid');
    this.gridNiveaus.classList.add('niveaus');

    for (let niveau = 1; niveau < 11; niveau++) {
      let niveauElement = document.createElement('div');
      niveauElement.classList.add('graph-label-column');
      niveauElement.innerHTML = `<span class="graph-label-column-text">${niveau}</span>`;
      this.gridNiveaus.appendChild(niveauElement);
    }

    let gridNiveausClone = this.gridNiveaus.cloneNode(true);
    gridNiveausClone.classList.add('sticky');
    this.element.appendChild(gridNiveausClone);

    this.element.appendChild(this.gridNiveaus);
  }

  createGridYears () {
    this.gridYears = document.createElement('div');
    this.gridYears.classList.add('graph-grid');
    this.gridYears.classList.add('years');

    for (let year = this.years.first; year < this.years.last + 1; year++) {
      let yearElement = document.createElement('div');
      yearElement.classList.add('graph-label-column');
      yearElement.innerHTML = `<span class="graph-label-column-text">'${year.toString().substr(2)}</span>`;
      this.gridYears.appendChild(yearElement);
    }

    let gridYearsClone = this.gridYears.cloneNode(true);
    gridYearsClone.classList.add('sticky');
    this.element.appendChild(gridYearsClone);

    this.element.appendChild(this.gridYears);
  }

  displayYears () {
    localStorage.setItem('showGraph', 'Years');
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
    localStorage.setItem('showGraph', 'Niveaus');
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
