(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.danielbeeke = global.danielbeeke || {})));
}(this, (function (exports) { 'use strict';

var hamburger = document.querySelector('.hamburger');

hamburger.addEventListener('click', function () {
  document.body.classList.toggle('has-active-menu');
});

document.addEventListener('keydown', function (event) {
  if (event.keyCode == 27 && document.body.classList.contains('has-active-menu')) {
    document.body.classList.remove('has-active-menu');
  }
});

var _slicedToArray = (function () {
  function sliceIterator(arr, i) {
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"]) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  return function (arr, i) {
    if (Array.isArray(arr)) {
      return arr;
    } else if (Symbol.iterator in Object(arr)) {
      return sliceIterator(arr, i);
    } else {
      throw new TypeError("Invalid attempt to destructure non-iterable instance");
    }
  };
})();

var _classCallCheck = (function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var Graph = function () {

  // Start the graph.
  function Graph(selector, data, firstYear, tooltips) {
    _classCallCheck(this, Graph);

    this.data = data;
    this.element = document.querySelector(selector);
    this.years = {
      first: firstYear,
      last: new Date().getFullYear()
    };
    this.tooltips = tooltips;

    this.aggregateGroups();
    this.createHeader();
    this.createGrid();
    this.createMarkup();
    this.attachEventListeners();

    var displayMode = localStorage.getItem('showGraph') || 'Years';
    this['display' + displayMode]();
  }

  // Creates the data from which we draw the graph.


  _createClass(Graph, [{
    key: 'aggregateGroups',
    value: function aggregateGroups() {
      var _this = this;

      var groupDefaults = {
        rows: [],
        yearsFrom: new Date().getFullYear(),
        yearsTill: this.years.last,
        rating: 0
      };

      this.groups = new Map(this.data.filter(function (row) {
        return row.group;
      }).map(function (row) {
        return [row.group, Object.assign({}, groupDefaults)];
      }));

      Array.from(this.groups).forEach(function (_ref) {
        var _ref2 = _slicedToArray(_ref, 2),
            groupName = _ref2[0],
            group = _ref2[1];

        group.rows = _this.data.filter(function (rowToFilter) {
          return rowToFilter.group === groupName;
        });

        group.rows.forEach(function (row) {
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

  }, {
    key: 'createHeader',
    value: function createHeader() {
      // Wrapper.
      this.headers = document.createElement('div');
      this.headers.classList.add('graph-headers-wrapper');
      this.element.appendChild(this.headers);

      // Years.
      this.headersYears = document.createElement('div');
      this.headersYears.classList.add('graph-headers');
      this.headersYears.classList.add('years');

      for (var year = this.years.first; year < this.years.last + 1; year++) {
        var yearElement = document.createElement('div');
        yearElement.classList.add('graph-headers-column');
        yearElement.innerHTML = '<span class="graph-header-label">\'' + year.toString().substr(2) + '</span>';
        this.headersYears.appendChild(yearElement);
      }

      this.headers.appendChild(this.headersYears);

      // Niveaus.
      this.headersNiveaus = document.createElement('div');
      this.headersNiveaus.classList.add('graph-headers');
      this.headersNiveaus.classList.add('niveaus');

      for (var niveau = 1; niveau < 11; niveau++) {
        var niveauElement = document.createElement('div');
        niveauElement.classList.add('graph-headers-column');
        niveauElement.innerHTML = '<span class="graph-header-label">' + niveau + '</span>';
        this.headersNiveaus.appendChild(niveauElement);
      }

      this.headers.appendChild(this.headersNiveaus);
    }

    // Create the background-grid.

  }, {
    key: 'createGrid',
    value: function createGrid() {
      // Wrapper.
      this.grid = document.createElement('div');
      this.grid.classList.add('graph-grid-wrapper');
      this.element.appendChild(this.grid);

      // Years.
      this.gridYears = document.createElement('div');
      this.gridYears.classList.add('graph-grid');
      this.gridYears.classList.add('years');

      for (var year = this.years.first; year < this.years.last + 1; year++) {
        var yearElement = document.createElement('div');
        yearElement.classList.add('graph-grid-column');
        this.gridYears.appendChild(yearElement);
      }

      this.grid.appendChild(this.gridYears);

      // Niveaus.
      this.gridNiveaus = document.createElement('div');
      this.gridNiveaus.classList.add('graph-grid');
      this.gridNiveaus.classList.add('niveaus');

      for (var niveau = 1; niveau < 11; niveau++) {
        var niveauElement = document.createElement('div');
        niveauElement.classList.add('graph-grid-column');
        this.gridNiveaus.appendChild(niveauElement);
      }

      this.grid.appendChild(this.gridNiveaus);
    }

    // Control events.

  }, {
    key: 'attachEventListeners',
    value: function attachEventListeners() {
      var _this2 = this;

      document.querySelector('.toggle.years').addEventListener('click', function () {
        _this2.displayYears();
      });

      document.querySelector('.toggle.niveaus').addEventListener('click', function () {
        _this2.displayNiveaus();
      });

      var tooltips = document.querySelectorAll('.tooltip');

      Array.from(tooltips).forEach(function (tooltip) {
        tooltip.addEventListener('click', function (event) {
          event.preventDefault();
          event.stopImmediatePropagation();
          _this2.closeAllTooltips(tooltip.dataset.tooltipId);
          var elements = document.querySelectorAll('[data-tooltip-id="' + tooltip.dataset.tooltipId + '"]');
          Array.from(elements).forEach(function (element) {
            element.classList.toggle('active');
          });
        });
      });

      var tooltipCloses = document.querySelectorAll('.tooltip-close');
      Array.from(tooltipCloses).forEach(function (tooltipClose) {
        tooltipClose.addEventListener('click', function () {
          _this2.closeAllTooltips();
        });
      });

      document.addEventListener('keydown', function (event) {
        if (event.keyCode === 27) {
          if (document.querySelectorAll('[data-tooltip-id].active').length) {
            _this2.closeAllTooltips();
          } else if (document.querySelectorAll('.group.expanded .graph-row-toggle').length) {
            var expandedGroups = document.querySelectorAll('.group.expanded .graph-row-toggle');
            Array.from(expandedGroups).forEach(function (expandedGroup) {
              expandedGroup.click();
            });
          }
        }
      });
    }
  }, {
    key: 'closeAllTooltips',
    value: function closeAllTooltips() {
      var ignore = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;

      var elements = document.querySelectorAll('[data-tooltip-id]');
      Array.from(elements).forEach(function (element) {
        if (element.dataset.tooltipId !== ignore) {
          element.classList.remove('active');
        }
      });
    }
  }, {
    key: 'createTooltip',
    value: function createTooltip(tooltipLabel, row) {
      if (this.tooltips[tooltipLabel]) {
        var tooltipElement = document.createElement('div');
        tooltipElement.classList.add('tooltip-text');
        tooltipElement.dataset.tooltipId = tooltipLabel.split(' ').join('-');
        tooltipElement.innerHTML = '<div class="tooltip-text-inner">\n        <h3 class="tooltip-title">' + tooltipLabel + '</h3>\n        <span class="years"><b>Aantal jaren ervaring:</b> ' + row.yearsFrom + ' tot ' + (row.yearsTill === 'now' ? 'heden' : row.yearsTill) + '</span><br>\n        <span class="rating"><b>Ervaringscijfer:</b> ' + row.rating + '</span>\n        <div class="tooltip-description">' + this.tooltips[tooltipLabel] + '</div>\n        <div class="tooltip-close"></div>\n      </div>';
        this.rowsWrapper.appendChild(tooltipElement);
      }
    }

    // Create rows.

  }, {
    key: 'createMarkup',
    value: function createMarkup() {
      var _this3 = this;

      this.rowsWrapper = document.createElement('div');
      this.rowsWrapper.classList.add('graph-rows');

      Array.from(this.groups).forEach(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 2),
            groupName = _ref4[0],
            group = _ref4[1];

        var tooltip = _this3.tooltips[groupName] ? '<span class="tooltip" data-tooltip-id="' + groupName.split(' ').join('-') + '">i</span>' : '';
        _this3.createTooltip(groupName, group);

        group.element = document.createElement('div');
        group.element.classList.add('graph-row');
        group.element.classList.add('group');
        group.element.innerHTML = '<span class="graph-row-label">' + groupName + ' ' + tooltip + '</span><div class="graph-row-toggle"></div>';
        _this3.rowsWrapper.appendChild(group.element);

        group.element.querySelector('.graph-row-toggle').addEventListener('click', function () {
          group.element.classList.toggle('expanded');
          group.rows.forEach(function (row) {
            row.element.classList.toggle('expanded');
          });
        });

        group.rows.forEach(function (row) {
          var tooltip = _this3.tooltips[row.label] ? '<span class="tooltip" data-tooltip-id="' + row.label.split(' ').join('-') + '">i</span>' : '';
          _this3.createTooltip(row.label, row);

          row.element = document.createElement('div');
          row.element.classList.add('graph-row');
          row.element.innerHTML = '<span class="graph-row-label">' + row.label + ' ' + tooltip + '</span>';
          _this3.rowsWrapper.appendChild(row.element);
        });
      });

      this.element.appendChild(this.rowsWrapper);
    }

    // Switch to year display.

  }, {
    key: 'displayYears',
    value: function displayYears() {
      localStorage.setItem('showGraph', 'Years');
      var graphFrom = this.years.first;
      var graphTill = this.years.last;

      var setRow = function setRow(row) {
        var rowFrom = row.yearsFrom;
        var rowTill = row.yearsTill === 'now' ? new Date().getFullYear() + 1 / 12 * (new Date().getMonth() + 1) : row.yearsTill;

        var oneYear = 100 / (graphTill - graphFrom + 1);

        var left = oneYear * (rowFrom - graphFrom);
        var width = oneYear * (rowTill - rowFrom);

        row.element.style.left = left + '%';
        row.element.style.width = width + '%';
      };

      Array.from(this.groups).forEach(function (_ref5) {
        var _ref6 = _slicedToArray(_ref5, 2),
            groupName = _ref6[0],
            group = _ref6[1];

        setRow(group);
        group.rows.forEach(function (row) {
          setRow(row);
        });
      });

      document.body.dataset.activeGrid = 'years';
      document.querySelector('.toggle.niveaus').classList.remove('active');
      document.querySelector('.toggle.years').classList.add('active');
    }

    // Switch to niveau display.

  }, {
    key: 'displayNiveaus',
    value: function displayNiveaus() {
      localStorage.setItem('showGraph', 'Niveaus');
      var graphFrom = 1;
      var graphTill = 10;

      var setRow = function setRow(row) {
        var rowFrom = 1;
        var rowTill = row.rating;

        var oneYear = 100 / graphTill;

        var left = oneYear * (rowFrom - graphFrom);
        var width = oneYear * (rowTill - rowFrom);

        row.element.style.left = left + '%';
        row.element.style.width = width + '%';
      };

      Array.from(this.groups).forEach(function (_ref7) {
        var _ref8 = _slicedToArray(_ref7, 2),
            groupName = _ref8[0],
            group = _ref8[1];

        setRow(group);
        group.rows.forEach(function (row) {
          setRow(row);
        });
      });

      document.body.dataset.activeGrid = 'niveaus';
      document.querySelector('.toggle.years').classList.remove('active');
      document.querySelector('.toggle.niveaus').classList.add('active');
    }
  }]);

  return Graph;
}();

var graphData = [{
  "label": "Drupal 6",
  "years": {
    "from": 2008,
    "till": 2011
  },
  "rating": 6.8,
  "group": "Drupal"
}, {
  "label": "Drupal 7",
  "years": {
    "from": 2011,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Drupal"
}, {
  "label": "Drupal 8",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 8.7,
  "group": "Drupal"
}, {
  "label": "jQuery",
  "years": {
    "from": 2010,
    "till": 2016
  },
  "rating": 8,
  "group": "Javascript frameworks"
}, {
  "label": "Meteor",
  "years": {
    "from": 2013,
    "till": 2016
  },
  "rating": 7,
  "group": "Javascript frameworks"
}, {
  "label": "Ember",
  "years": {
    "from": 2013,
    "till": 2014
  },
  "rating": 6,
  "group": "Javascript frameworks"
}, {
  "label": "Grunt en Gulp",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 8,
  "group": "Javascript frameworks"
}, {
  "label": "NodeJs",
  "years": {
    "from": 2015,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Javascript frameworks"
}, {
  "label": "ES6",
  "years": {
    "from": 2016,
    "till": "now"
  },
  "rating": 8,
  "group": "Javascript frameworks"
}, {
  "label": "Angular",
  "years": {
    "from": 2015,
    "till": 2017
  },
  "rating": 7,
  "group": "Javascript frameworks"
}, {
  "label": "VueJS",
  "years": {
    "from": 2016,
    "till": "now"
  },
  "rating": 8,
  "group": "Javascript frameworks"
}, {
  "label": "Vanilla CSS",
  "years": {
    "from": 2008,
    "till": 2014
  },
  "rating": 8.5,
  "group": "CSS"
}, {
  "label": "SASS",
  "years": {
    "from": 2012,
    "till": "now"
  },
  "rating": 8,
  "group": "CSS"
}, {
  "label": "SMACSS etc",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 8,
  "group": "CSS"
}, {
  "label": "PostCSS",
  "years": {
    "from": 2016,
    "till": "now"
  },
  "rating": 7.5,
  "group": "CSS"
}, {
  "label": "Technische team lead",
  "years": {
    "from": 2013,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Softskills en leiderschap"
}, {
  "label": "Architect",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 8,
  "group": "Softskills en leiderschap"
}, {
  "label": "Sales ondersteuning",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Softskills en leiderschap"
}, {
  "label": "Afstudeerders/stagairs",
  "years": {
    "from": 2014,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Softskills en leiderschap"
}, {
  "label": "Scrum teamlid",
  "years": {
    "from": 2015,
    "till": "now"
  },
  "rating": 7,
  "group": "Softskills en leiderschap"
}, {
  "label": "Designsprints",
  "years": {
    "from": 2015,
    "till": "now"
  },
  "rating": 8,
  "group": "Softskills en leiderschap"
}, {
  "label": "Flash",
  "years": {
    "from": 2006,
    "till": 2008
  },
  "rating": 7,
  "group": "Grafische software"
}, {
  "label": "CorelDraw",
  "years": {
    "from": 2006,
    "till": 2009
  },
  "rating": 7,
  "group": "Grafische software"
}, {
  "label": "Inkscape",
  "years": {
    "from": 2008,
    "till": "now"
  },
  "rating": 8,
  "group": "Grafische software"
}, {
  "label": "The Gimp",
  "years": {
    "from": 2008,
    "till": "now"
  },
  "rating": 7,
  "group": "Grafische software"
}, {
  "label": "Blender",
  "years": {
    "from": 2008,
    "till": 2011
  },
  "rating": 4,
  "group": "Grafische software"
}, {
  "label": "Axure, Sketch",
  "years": {
    "from": 2016,
    "till": "now"
  },
  "rating": 7,
  "group": "Grafische software"
}, {
  "label": "Fedora Core",
  "years": {
    "from": 2006,
    "till": 2009
  },
  "rating": 5,
  "group": "Linux"
}, {
  "label": "Ubuntu",
  "years": {
    "from": 2009,
    "till": "now"
  },
  "rating": 8,
  "group": "Linux"
}, {
  "label": "CentOS",
  "years": {
    "from": 2011,
    "till": 2012
  },
  "rating": 6.5,
  "group": "Linux"
}, {
  "label": "Debian",
  "years": {
    "from": 2012,
    "till": "now"
  },
  "rating": 8,
  "group": "Linux"
}, {
  "label": "GIT",
  "years": {
    "from": 2010,
    "till": "now"
  },
  "rating": 7,
  "group": "Overige software ontwikkeling"
}, {
  "label": "Jira",
  "years": {
    "from": 2012,
    "till": "now"
  },
  "rating": 8,
  "group": "Overige software ontwikkeling"
}, {
  "label": "BOA Drupal hosting",
  "years": {
    "from": 2012,
    "till": "now"
  },
  "rating": 8,
  "group": "Overige software ontwikkeling"
}, {
  "label": "Cachelagen, Redis, Memcache",
  "years": {
    "from": 2013,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Overige software ontwikkeling"
}, {
  "label": "Talks op meetups",
  "years": {
    "from": 2012,
    "till": "now"
  },
  "rating": 6.8,
  "group": "Hobby en opensource"
}, {
  "label": "Atlast",
  "years": {
    "from": 2014,
    "till": 2017
  },
  "rating": 7,
  "group": "Hobby en opensource"
}, {
  "label": "OpenGroup",
  "years": {
    "from": 2015,
    "till": "now"
  },
  "rating": 8,
  "group": "Hobby en opensource"
}, {
  "label": "Rhythm<wbr>Meister",
  "years": {
    "from": 2016,
    "till": 2018
  },
  "rating": 8,
  "group": "Hobby en opensource"
}, {
  "label": "Sprink<wbr>haan",
  "years": {
    "from": 2016,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Hobby en opensource"
}, {
  "label": "Onitama",
  "years": {
    "from": 2017,
    "till": "now"
  },
  "rating": 7.5,
  "group": "Hobby en opensource"
}];

var graphTooltips = {
  'Drupal': "Een content management systeem maar ook een framework om complexe enterprise applicaties in te bouwen. <br><br>Ik heb er van alles mee gemaakt, van een wifi tickets systeem voor campings tot een benchmark tool voor een branchevereniging, meertalige websites tot webshops.",
  'Drupal 6': "Hier ben ik mee begonnen. Een aantal websites meegemaakt en 1 grote met 20+ <a href=\"https://drupal.org/project/features\" target=\"_blank\">features</a>. Wat een brak systeem zo terug kijkend.",
  'Drupal 7': "In Drupal 7 heb ik leren modules maken. Samen met het team van Fonkel heb ik heb denk ik meer dan 30 websites gemaakt in Drupal 7. Ik heb veel custom modules gemaakt waarvan enkele op <a href=\"https://www.drupal.org/u/danielbeeke\" target=\"_blank\">drupal.org</a> staan.",
  'Drupal 8': "Hiermee zijn we bij Fonkel vroeg begonnen. We hebben een meertalige Drupal 8 website gemaakt terwijl Drupal 8 nog ontwikkeld werd. Dit was behoorlijk lastig maar erg leerzaam. We hebben ook meegewerkt aan patches en issues.",
  'Meteor': 'Een vet framework, samen met Laurens Bruijn heb ik een app gemaakt voor de overheid. Dit was voor een evenement. Meteor maakt sommige real-time dingen erg makkelijk. In Meteor heb ik ook gewerkt aan een <a href="https://github.com/danielbeeke/taiga-scrum-poker" target="_blank">Scrum Poker app voor Taiga</a>.',
  'VueJS': "OpenGroup en een aantal ander projecten heb ik in VueJs gemaakt. Ik vind het een prachtig framewerk. Licht gewicht, eenvoudig in het begin, schaalbaar en flexibel genoeg om complexe projecten mee te maken.",
  'ES6': "De nieuwste versie van javascript. Toen het mogelijk was om dit te gebruiken via Babel ben ik er snel mee gaan experimenteren. <a href=\"https://github.com/danielbeeke/onitama\" target=\"_blank\">Onitama</a> heb ik geschreven om ES6 te leren.",
  'jQuery': "jQuery ken ik als mijn broekzak. Tegenwoordig is het niet echt meer nodig om het te gebruiken omdat het grotendeels in de browsers zit met schonere API's.",
  'Javascript frameworks': "Nadat ik lange tijd alles in Drupal maakte ben ik gaan spelen met statische HTML en javascript. Ik vind javascript erg leuk en heb het gevoel dat de taal zich erg goed leent voor flexibele truukjes en elegante code. Overigens is het natuurlijk ook prima mogelijk om een hoop spaghetti code ermee te schrijven. Steeds meer en meer maak ik nette en goed beheersbare javsacript projecten.",
  'Angular': 'Voor een groot overheidsproject heb ik met Angular gewerkt. Ik had nog geen ervaring toen we begonnen maar al snel had ik Angular in de vingers. Samen met een groot team heb ik een applicatie gebouwd waarmee je applicaties kunt maken om data te visualiseren. Mijn rol in deze opdracht was de architectuur, frontend ontwikkelaar en frontend coach. Samen met Fonkel en Graphius hebben we een designsprint-achtige week van prototyping gehad.',
  'SASS': "Binnen Fonkel heb ik SASS geleerd. Ik heb mixins geschreven en veel gewerkt met SingularityGs en Susy. Ook heb ik <a href=\"http://rhythmmeister.com/\" target=\"_blank\">Rhythmmeister</a> eerst in Sass geschreven.",
  'PostCSS': 'Autoprefixer is een tool die ik altijd gebruik, verder heb ik <a href="http://rhythmmeister.com/" target="_blank">Rhythmmeister</a> gemaakt. Een tool voor mooie typografie op het internet.',
  'CSS': 'Ik heb veel ervaring met CSS in grote projecten. Aan het begin was het een lastige uitdaging om alles bheersbaar te houden. Nu heb ik de truukjes en de methodieken onder de knie om beheersbare en onderhoudbare projecten op te zetten met veel componenten.',
  'SMACSS etc': 'ik heb SMACSS en BEM gebruikt. Binnen Drupal gebruikten we bij Fonkel een soort van mix van die twee, uitgelegd in de presentatie <a href="https://danielbeeke.nl/everything-is-a-viewmode" target="_blank">Everything is a viewmode</a>.',
  'Technische team lead': "Binnen Fonkel ben ik 4 a 5 jaar de technische team lead geweest. Ik ben er namelijk langzaam in gegroeid. Ik begeleide projecten en hielp de andere programmeurs. Soms om problemen op te lossen soms om de oplossingen te verbeteren. Vaak ging ik mee naar klanten en deed ik voorbereidend architectuur werk.",
  'Architect': 'Dit is iets wat ik super leuk vind, een complex probleem leren begrijpen en daarna zo goed mogelijk oplossen. Bij meerdere grote projecten heb ik de architectuur mogen doen. Bij een overheidsorgaan waar ik gedetacheerd was en vele projecten binnen Fonkel. Wanneer ik het project bij Fonkel zelf niet leidde was ik vaak betrokken als coach over de architectuur.',
  'Sales ondersteuning': 'Samen met Floris van Fonkel ben ik bij veel verkoopsgesprekken geweest. Soms raak soms niet raak. Mijn rol was vooral het delen van mijn expertise, vaak kon ik daar enthoisiast over vertellen. Ook maakte ik vaak al een model in mijn hoofd wat er gebouwd moest worden.',
  'Afstudeerders/stagairs': "Bij Fonkel heb ik meerdere afstudeerders en stagairs begeleid. Ik vind het erg leuk werk.",
  'Talks op meetups': "Ik heb meerdere keren op de Drupaljam gespreken. Ook heb ik met regelmaat op wat kleinere meetups gesproken. Voornamelijk over Drupal en javascript."
};

function ScrollTo(elementY, duration, callback) {
  var scrollWrapper = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : window;

  var startingY = scrollWrapper === window ? scrollWrapper.pageYOffset : scrollWrapper.scrollTop;
  var diff = elementY - startingY;
  var start;

  if (!diff && typeof callback === 'function') {
    callback();
  }

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  window.requestAnimationFrame(function step(timestamp) {
    if (!start) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    var time = timestamp - start;
    // Get percent of completion in range [0, 1].
    var percent = Math.min(time / duration, 1);

    scrollWrapper.scrollTo(0, startingY + diff * percent);

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    } else if (typeof callback === 'function') {
      callback();
    }
  });
}

var Links = function Links() {
  _classCallCheck(this, Links);

  window.addEventListener('hashchange', function (event) {
    event.preventDefault();
  }, false);

  var links = document.querySelectorAll('a.menu-item, a.link');
  var siteHeader = document.querySelector('.site-header');
  Array.from(links).forEach(function (link) {
    link.addEventListener('click', function (event) {
      var id = link.href.split('#')[1];
      var linkedContent = document.querySelector('#' + id);

      if (!linkedContent) return;

      event.preventDefault();
      var rowStyles = window.getComputedStyle(document.querySelector('.row'), null);
      var linkedContentY = window.pageYOffset + linkedContent.getBoundingClientRect().top - siteHeader.offsetHeight - parseInt(rowStyles.marginBottom) / 2;

      if (link.classList.contains('menu-item')) {
        document.body.classList.remove('has-active-menu');

        setTimeout(function () {
          ScrollTo(linkedContentY, 400);
        }, 700);
      } else {
        ScrollTo(linkedContentY, 400);
      }
    });
  });
};

function OneTransitionEnd(element, cssProperty, className) {
  var operation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'add';

  return new Promise(function (resolve) {

    var innerCallback = function innerCallback(event) {
      if (event.propertyName === cssProperty) {
        element.removeEventListener('transitionend', innerCallback);
        resolve();
      }
    };

    setTimeout(function () {
      element.addEventListener('transitionend', innerCallback);
      element.classList[operation](className);
    });
  });
}

var Gallery = function Gallery(galleryItems, clickedItem) {
  _classCallCheck(this, Gallery);

  var items = [];

  var photoSwipeTemplate = '\n      <div class="pswp__bg"></div>\n      <div class="pswp__scroll-wrap">\n          <div class="pswp__container">\n              <div class="pswp__item"></div>\n              <div class="pswp__item"></div>\n              <div class="pswp__item"></div>\n          </div>\n          <div class="pswp__ui pswp__ui--hidden">\n              <div class="pswp__top-bar">\n                  <div class="pswp__counter"></div>\n\n                  <button class="pswp__button--close pswp__single-tap" title="Close (Esc)">\n                      <div class="zoom-in-icon pswp__closer">\n                          <div class="zoom-in-icon-part pswp__closer"></div>\n                      </div>\n                  </button>\n                  <div class="pswp__preloader">\n                      <div class="pswp__preloader__icn">\n                          <div class="pswp__preloader__cut">\n                              <div class="pswp__preloader__donut"></div>\n                          </div>\n                      </div>\n                  </div>\n              </div>\n\n              <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">\n                  <div class="pswp__share-tooltip"></div>\n              </div>\n\n              <button class="pswp__button pswp__button--arrow--left" title="Previous (arrow left)">\n              </button>\n\n              <button class="pswp__button pswp__button--arrow--right" title="Next (arrow right)">\n              </button>\n\n              <div class="pswp__caption">\n                  <div class="pswp__caption__center"></div>\n              </div>\n          </div>\n      </div>';

  if (!document.querySelector('.pswp')) {
    var pswpWrapper = document.createElement('div');
    pswpWrapper.classList.add('pswp');
    pswpWrapper.tabIndex = -1;
    pswpWrapper.setAttribute('role', 'dialog');
    pswpWrapper.setAttribute('aria-hidden', true);
    pswpWrapper.innerHTML = photoSwipeTemplate;
    document.body.appendChild(pswpWrapper);
  }

  clickedItem.parentNode.style.zIndex = 9000;
  clickedItem.parentNode.classList.add('transitions');

  document.body.classList.add('has-case-gallery-item-fullscreen');

  OneTransitionEnd(clickedItem.parentNode, 'clip-path', 'active').then(function () {
    galleryItems.forEach(function (galleryItem) {
      var width = window.innerWidth * 2;
      var widthFactor = width / galleryItem.clientWidth;
      var height = galleryItem.clientHeight * widthFactor;

      items.push({
        msrc: galleryItem.src,
        src: galleryItem.src.replace('/thumbs', ''),
        w: width,
        h: height
      });
    });

    var pswpElement = document.querySelector('.pswp');

    var options = {
      index: Array.from(galleryItems).indexOf(clickedItem),
      preload: [2, 2],
      history: false,
      tapToToggleControls: true,
      closeElClasses: ['closer'],
      tapToClose: true,
      loadingIndicatorDelay: 0,
      getThumbBoundsFn: function getThumbBoundsFn(index) {
        var pageYScroll = window.pageYOffset || document.documentElement.scrollTop;
        var galleryItem = Array.from(galleryItems)[index];
        var rect = galleryItem.getBoundingClientRect();
        return { x: rect.left, y: rect.top + pageYScroll, w: rect.width };
      }
    };

    var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);

    gallery.listen('initialZoomIn', function () {
      clickedItem.parentNode.classList.remove('transitions');
      clickedItem.parentNode.classList.add('hidden');
      clickedItem.parentNode.style.zIndex = 'auto';
    });

    gallery.listen('initialZoomInEnd', function () {
      clickedItem.parentNode.classList.remove('hidden');
      clickedItem.parentNode.classList.remove('active');
    });

    var zoomOut = function zoomOut() {
      var index = gallery.getCurrentIndex();
      var galleryItem = Array.from(galleryItems)[index];

      galleryItem.parentNode.classList.add('active');
      galleryItem.parentNode.classList.add('hidden');
      galleryItem.parentNode.style.zIndex = 9000;
    };

    gallery.listen('preventDragEvent', zoomOut);

    gallery.listen('initialZoomOut', zoomOut);

    gallery.listen('beforeChange', function () {
      Array.from(galleryItems).forEach(function (galleryItem) {
        galleryItem.parentNode.classList.remove('active');
        galleryItem.parentNode.classList.remove('hidden');
        galleryItem.parentNode.style.zIndex = '';
      });
    });

    gallery.listen('destroy', function () {
      var index = gallery.getCurrentIndex();
      var galleryItem = Array.from(galleryItems)[index];

      galleryItem.parentNode.classList.remove('hidden');
      galleryItem.parentNode.classList.add('transitions');

      setTimeout(function () {
        OneTransitionEnd(galleryItem.parentNode, 'clip-path', 'active', 'remove').then(function () {
          galleryItem.parentNode.style.zIndex = 'auto';
          galleryItem.parentNode.classList.remove('transitions');
          document.body.classList.remove('has-case-gallery-item-fullscreen');
        });
      }, 100);
    });

    gallery.init();
  });
};

var Showcases = function Showcases() {
  var _this = this;

  _classCallCheck(this, Showcases);

  var showcases = document.querySelectorAll('.showcase');
  this.speed = 400;

  document.addEventListener('keydown', function (event) {
    if (event.keyCode == 27 && _this.currentShowCase) {
      var pswpElement = document.querySelector('.pswp');

      if (!pswpElement || !pswpElement.classList.contains('pswp--visible')) {
        closeShowcase(_this.currentShowCase, _this.currentShowCaseClone);
      }
    }
  });

  var openShowcase = function openShowcase(showcase) {
    document.body.classList.add('has-expanded-showcase');
    document.body.classList.add('show-backdrop');
    var boundingRect = showcase.getBoundingClientRect();
    var showcaseClone = showcase.cloneNode(true);
    showcase.classList.add('hidden');
    var title = showcaseClone.querySelector('.title');
    var description = showcaseClone.querySelector('.description');
    _this.currentShowCase = showcase;
    _this.currentShowCaseClone = showcaseClone;

    showcaseClone.querySelector('.zoom-in-icon').addEventListener('click', function () {
      closeShowcase(showcase, showcaseClone);
    });

    document.body.appendChild(showcaseClone);

    var items = showcaseClone.querySelectorAll('.gallery-item');
    Array.from(items).forEach(function (item) {
      item.addEventListener('click', function (event) {
        new Gallery(items, item);
      }, false);
    });

    setTimeout(function () {
      showcaseClone.classList.add('is-going-fullscreen');
    });

    showcaseClone.style.left = boundingRect.left + 'px';
    showcaseClone.style.top = boundingRect.top + 'px';
    showcaseClone.style.width = boundingRect.width + 'px';
    showcaseClone.style.height = boundingRect.height + 'px';
    showcaseClone.style.position = 'fixed';
    showcaseClone.style.zIndex = 20000;
    showcaseClone.style.cursor = 'default';
    showcaseClone.style.backgroundImage = showcase.style.backgroundImage;

    var fontSize = window.getComputedStyle(title, null).getPropertyValue('font-size');
    var fontSizeMultiplied = parseInt(fontSize) * 2 + 'px';

    var easing = 'cubic-bezier(.37,.1,.36,.78)';

    description.animate({
      'maxWidth': [boundingRect.width - 40 + 'px', '1080px']
    }, {
      duration: _this.speed,
      fill: 'forwards',
      easing: easing
    });

    title.animate({
      'fontSize': [fontSize, fontSizeMultiplied],
      'maxWidth': [boundingRect.width - 40 + 'px', '1080px']
    }, {
      duration: _this.speed,
      fill: 'forwards',
      easing: easing
    });

    var animation = showcaseClone.animate({
      top: [boundingRect.top + 'px', '0px'],
      left: [boundingRect.left + 'px', '0px'],
      width: [boundingRect.width + 'px', '100vw'],
      height: [boundingRect.height + 'px', '102vh'],
      borderRadius: ['7px', 0],
      borderWidth: ['3px', 0],
      margin: ['2px', 0]
    }, {
      duration: _this.speed,
      fill: 'forwards',
      easing: easing
    });

    animation.onfinish = function () {
      showcaseClone.classList.add('is-fullscreen');
    };
  };

  var closeShowcase = function closeShowcase(showcase, showcaseClone) {
    ScrollTo(0, 300, function () {
      var boundingRect = showcase.getBoundingClientRect();
      var easing = 'cubic-bezier(.74,.19,.72,.91)';
      var title = showcaseClone.querySelector('.title');
      var description = showcaseClone.querySelector('.description');
      var originalTitle = showcase.querySelector('.title');

      OneTransitionEnd(showcaseClone, 'opacity', 'is-fullscreen', 'remove').then(function () {
        var animation = showcaseClone.animate({
          top: ['0px', boundingRect.top + 'px'],
          left: ['0px', boundingRect.left + 'px'],
          width: ['100vw', boundingRect.width + 'px'],
          height: ['102vh', boundingRect.height + 'px'],
          borderRadius: [0, '7px'],
          borderWidth: [0, '3px']
        }, {
          duration: _this.speed,
          fill: 'forwards',
          easing: easing
        });

        var fontSize = window.getComputedStyle(originalTitle, null).getPropertyValue('font-size');
        var fontSizeMultiplied = parseInt(fontSize) * 2 + 'px';

        title.animate({
          'fontSize': [fontSizeMultiplied, fontSize],
          'maxWidth': ['1080px', boundingRect.width - 40 + 'px']
        }, {
          duration: _this.speed,
          fill: 'forwards',
          easing: easing
        });

        description.animate({
          'maxWidth': ['1080px', boundingRect.width - 40 + 'px']
        }, {
          duration: _this.speed,
          fill: 'forwards',
          easing: easing
        });

        showcase.classList.remove('hidden');

        setTimeout(function () {
          document.body.classList.remove('show-backdrop');
        }, 200);

        animation.onfinish = function () {
          OneTransitionEnd(showcaseClone, 'opacity', 'is-going-fullscreen', 'remove').then(function () {
            showcaseClone.remove();
            document.body.classList.remove('has-expanded-showcase');
          });
        };
      });
    }, showcaseClone.querySelector('.scroll-wrapper'));
  };

  Array.from(showcases).forEach(function (showcase) {
    showcase.addEventListener('click', function (event) {
      event.preventDefault();

      if (!showcase.classList.contains('is-fullscreen')) {
        var boundingRect = showcase.getBoundingClientRect();
        var siteHeader = document.querySelector('.site-header');

        if (boundingRect.top < siteHeader.clientHeight) {
          ScrollTo(window.pageYOffset + boundingRect.top - siteHeader.clientHeight - 20, 300, function () {
            openShowcase(showcase);
          });
        } else {
          openShowcase(showcase);
        }
      }
    });
  });
};

var graph = new Graph('#graph', graphData, 2006, graphTooltips);

document.addEventListener('scroll', function () {
  var graphGridOffsetTop = document.querySelector('.graph-grid-wrapper').getBoundingClientRect().top;

  document.body.classList[window.pageYOffset ? 'add' : 'remove']('has-scrolled');
  document.body.classList[graphGridOffsetTop < 90 ? 'add' : 'remove']('has-graph-sticky-header');
});

var links = new Links();
var showcases = new Showcases();

setTimeout(function () {
  document.body.classList.remove('no-transitions');
}, 300);

if (!document.body.animate) {
  var script = document.createElement('script');
  script.type = 'text/javascript';
  script.src = 'https://rawgit.com/web-animations/web-animations-js/master/web-animations.min.js';
  document.head.appendChild(script);
}

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=build.js.map