(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.danielbeeke = {})));
}(this, (function (exports) { 'use strict';

  var _toConsumableArray = (function (arr) {
    if (Array.isArray(arr)) {
      for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
        arr2[i] = arr[i];
      }return arr2;
    } else {
      return Array.from(arr);
    }
  });

  var cardSlider = document.querySelector('.card-slider');
  var fakeContent = document.querySelector('.card-slider-fake-content');
  var horizontalWidth = cardSlider.scrollWidth;

  fakeContent.style.height = horizontalWidth + 'px';
  var odometer = document.querySelector('.current-card-number');

  cardSlider.addEventListener('scroll', function (event) {
    var cards = [].concat(_toConsumableArray(cardSlider.querySelectorAll('.card')));
    cards.forEach(function (card) {
      var rect = card.getBoundingClientRect();

      if (rect.x < window.innerWidth / 2 && rect.x + rect.width > window.innerWidth / 2) {
        card.classList.add('center');
      } else {
        card.classList.remove('center');
      }
    });

    var currentCenterCard = cardSlider.querySelector('.card.center');

    if (currentCenterCard) {
      var index = Array.from(cardSlider.children).indexOf(currentCenterCard);
      odometer.innerHTML = index;
    }
  }, { passive: true });

  var hamster = Hamster(window);

  hamster.wheel(function (event, delta, deltaX, deltaY) {
    if (document.body.classList.contains('has-open-about')) {
      return;
    }
    if (document.body.classList.contains('has-fullscreen-teaser-expander')) {
      return;
    }

    cardSlider.scrollLeft += delta;
  });

  var mousePointer = document.querySelector('.mouse-pointer');
  var cardSlider$1 = document.querySelector('.card-slider');

  window.addEventListener('mousemove', function (event) {
    mousePointer.style.transform = 'translate(' + event.clientX + 'px, ' + event.clientY + 'px)';

    if (event.target && event.target.closest) {
      var parent = event.target.closest('[data-mouse-class]');

      if (parent) {
        document.body.dataset.mouse = parent.dataset.mouseClass;
      } else {
        document.body.dataset.mouse = '';
      }
    } else {
      document.body.dataset.mouse = '';
    }
  });

  var clickTimeout = false;

  window.addEventListener('click', function (event) {
    document.body.classList.add('is-clicking');

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    clickTimeout = setTimeout(function () {
      document.body.classList.remove('is-clicking');
    }, 100);
  });

  window.addEventListener('mousedown', function (event) {
    document.body.classList.add('is-clicking');
  });

  window.addEventListener('mouseup', function (event) {
    document.body.classList.remove('is-clicking');
  });

  var cards = [].concat(_toConsumableArray(cardSlider$1.querySelectorAll('.card')));

  cards.forEach(function (card) {
    var teaserExpander = card.querySelector('teaser-expander');

    if (teaserExpander) {
      teaserExpander.addEventListener('expand', function () {
        teaserExpander.dataset.mouseClass = '';
      });

      teaserExpander.addEventListener('collapse', function () {
        teaserExpander.dataset.mouseClass = 'card';
      });
    }
  });

  var teaserExpanders = document.querySelectorAll('teaser-expander[data-html]');

  if (teaserExpanders) {

    var totalCards = document.querySelector('.total-card-number');

    totalCards.innerHTML = teaserExpanders.length;

    Array.from(teaserExpanders).forEach(function (teaserExpander) {
      teaserExpander.addEventListener('expand', function () {
        if (teaserExpander.dataset.html) {
          fetch(teaserExpander.dataset.html).then(function (response) {
            return response.text();
          }).then(function (response) {
            teaserExpander.innerHTML = response;
            teaserExpander.removeAttribute('data-html');
            var closeButton = teaserExpander.querySelector('.close-teaser-expander');

            if (closeButton) {
              closeButton.addEventListener('click', function () {
                teaserExpander.expanded = false;
              });
            }
          });
        }
      });
    });
  }

  var _classCallCheck = (function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  });

  var _possibleConstructorReturn = (function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
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

  var _inherits = (function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  });

  /**
   * Returns the name of the transitionend event.
   * @returns {*}
   */
  function whichTransitionEvent() {
    var t = void 0,
        el = document.createElement("fakeelement");

    var transitions = {
      "transition": "transitionend",
      "OTransition": "oTransitionEnd",
      "MozTransition": "transitionend",
      "WebkitTransition": "webkitTransitionEnd"
    };

    for (t in transitions) {
      if (el.style[t] !== undefined) {
        return transitions[t];
      }
    }
  }

  var transitionEndType = whichTransitionEvent();

  /**
   * Easy attaching on one time callbacks when a css property is transitioned.
   *
   * How to use:
   * element.oneTransitionEnd('opacity', () => { console.log('done') })
   *
   * @param property
   * @param callback
   * @param cssClassName
   * @returns {HTMLElement}
   */
  HTMLElement.prototype.oneTransitionEnd = function (property, callback) {
    var _this = this;

    if (transitionEndType) {
      var innerCallback = function innerCallback(event) {
        if (event.propertyName.substr(-property.length) === property && event.target === _this) {
          callback();
          _this.removeEventListener(transitionEndType, innerCallback);
        }
      };

      this.addEventListener(transitionEndType, innerCallback);
    } else {
      callback();
    }

    return this;
  };

  function ScrollTo(elementY, duration) {
    var scrollWrapper = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : window;
    var callback = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : false;

    var startingY = scrollWrapper === window ? scrollWrapper.pageYOffset : scrollWrapper.scrollTop;
    var diff = elementY - startingY;
    var start = void 0;

    if (!diff && typeof callback === 'function') {
      return callback();
    }

    // Bootstrap our animation - it will get called right before next frame shall be rendered.
    var step = function step(timestamp) {
      if (!start) start = timestamp;
      // Elapsed milliseconds since start of scrolling.
      var time = timestamp - start;
      // Get percent of completion in range [0, 1].
      var percent = Math.min(time / duration, 1);

      scrollWrapper.scrollTo(0, Math.round(startingY + diff * percent));

      // Proceed with animation as long as we wanted it to.
      if (time < duration) {
        window.requestAnimationFrame(step);
      } else if (typeof callback === 'function') {
        callback();
      }
    };

    window.requestAnimationFrame(step);
  }

  var template = '<div class="teaser-expander-backdrop"></div>\n<div class="teaser-expander-inner">\n  <div class="teaser-expander-header">\n    <slot name="header"></slot>    \n  </div>\n  <div class="teaser-expander-content">\n    <slot name="content"></slot>        \n  </div>\n</div>';

  var css = function css() {
    var depth = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 0;
    var inset = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 20;

    return '\n  :host {\n    position: relative;\n    display: block;\n    user-select: none;\n    z-index: 1;\n    transition: box-shadow .4s ease-in-out;\n    box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);\n  }\n  \n  :host:after {\n    // transition: all .4s ease-in-out;\n    pointer-events: none;\n    content: \'\';\n    display: block;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100vw;\n    height: 100vh;\n    z-index: -1;\n    background-color: black;\n    opacity: 0;\n  }\n\n  .teaser-expander-inner {\n    display: block;\n    position: absolute;\n    background-size: cover;\n    background-repeat: no-repeat;\n    background-position: center center;\n    height: 100%;\n    width: 100%;\n    // transition: all .4s cubic-bezier(.2,.1,.65,.95);\n    box-sizing: border-box;\n    overflow: hidden;\n  }\n  \n  :host(:not([expanded]):focus) {\n    box-shadow: 0 0 0 7px rgba(0, 0, 0, .3);\n  }\n  \n  :host([busy]) {\n    pointer-events: none;\n  }\n  \n  .teaser-expander-backdrop {\n    background: black;\n    position: fixed;\n    top: 0;\n    left: 0;\n    opacity: 0;\n    pointer-events: none;\n    width: 100%;\n    height: 100%;\n    z-index: -1;\n  }\n  \n  .teaser-expander-content {\n    // transition: all .4s ease-in-out;\n    opacity: 0;\n    width: 100%;\n    height: calc(100%);\n    box-sizing: border-box;\n  }\n  \n  :host(.expanded):after {\n    opacity: .8;\n    transition-delay: .1s;\n  }\n  \n  :host(.expanded) .teaser-expander-inner {\n    width: calc(100vw - ' + depth * inset * 2 + 'px) !important;\n    height: calc(100vh - ' + depth * inset * 2 + 'px) !important;\n    left: calc(50vw - ' + (depth - 1) * inset + 'px) !important;\n    top: calc(50vh - ' + (depth - 1) * inset + 'px) !important;\n    transform: translate(-50%, -50%) !important;\n  }\n  \n  :host(.content-visible) .teaser-expander-content {\n    opacity: 1;\n    transition-delay: .6s;\n  }';
  };

  customElements.define('teaser-expander', function (_HTMLElement) {
    _inherits(TeaserExpander, _HTMLElement);

    _createClass(TeaserExpander, null, [{
      key: 'observedAttributes',
      get: function get() {
        return ['expanded'];
      }
    }]);

    function TeaserExpander() {
      _classCallCheck(this, TeaserExpander);

      var _this = _possibleConstructorReturn(this, (TeaserExpander.__proto__ || Object.getPrototypeOf(TeaserExpander)).call(this));

      _this.inset = window.innerWidth > 500 ? 40 : 0;
      _this.rect = false;
      _this.innerAnimation = false;
      _this.outerAnimation = false;
      _this.speed = 300;
      _this.depth = _this.getDepth();
      _this.easing = 'cubic-bezier(.2,.1,.65,.95)';
      _this.attachShadow({ mode: 'open' }).innerHTML = template + '<style>' + css(_this.depth, _this.inset) + '</style>';
      _this.inner = _this.shadowRoot.querySelector('.teaser-expander-inner');
      _this.header = _this.shadowRoot.querySelector('.teaser-expander-header');
      _this.content = _this.shadowRoot.querySelector('.teaser-expander-content');
      _this.backdrop = _this.shadowRoot.querySelector('.teaser-expander-backdrop');
      _this.attachEvents();
      _this.busy = false;

      if (!window.teaserExpanders) {
        window.teaserExpanders = [];
      }

      document.addEventListener('keyup', function (event) {
        if (event.key === 'Escape' && _this.expanded) {
          window.requestAnimationFrame(function () {
            var lastOpened = window.teaserExpanders[window.teaserExpanders.length - 1];
            lastOpened.expanded = false;
          });
        }
      });
      return _this;
    }

    _createClass(TeaserExpander, [{
      key: 'getDepth',
      value: function getDepth() {
        var parent = this.parentElement;
        var counter = 0;

        while (parent) {
          if (parent.nodeName === 'TEASER-EXPANDER') {
            counter++;
          }

          if (parent) {
            parent = parent.parentElement;
          }
        }

        return counter + 1;
      }
    }, {
      key: 'attachEvents',
      value: function attachEvents() {
        var _this2 = this;

        this.addEventListener('click', function (event) {
          if (!_this2.expanded && !_this2.busy) {
            _this2.expanded = true;
          }
        });

        this.addEventListener('keypress', function (event) {
          if (event.key === 'Enter' && !_this2.expanded && !_this2.busy) {
            _this2.expanded = true;
          }
        });
      }
    }, {
      key: 'attributeChangedCallback',
      value: function attributeChangedCallback(name) {
        var _this3 = this;

        if (name === 'expanded') {

          /**
           * Expand
           */
          if (this.expanded) {
            this.busy = true;
            this.dispatchEvent(new CustomEvent('expand'));
            window.teaserExpanders.push(this);
            this.applyUrl();
            // document.documentElement.style.overflowY = 'hidden';
            document.body.classList.add('has-fullscreen-teaser-expander');
            this.rect = this.inner.getBoundingClientRect();
            this.inner.style.position = 'fixed';
            this.style.zIndex = 100;
            this.backdropAnimation = this.backdrop.animate({
              'opacity': ['0', '1']
            }, {
              duration: 180,
              fill: 'forwards'
            });

            this.outerAnimation = this.inner.animate({
              'width': [this.rect.width + 'px', 'calc(100vw - ' + this.depth * this.inset * 2 + 'px)'],
              'height': [this.rect.height + 'px', 'calc(100vh - ' + this.depth * this.inset * 2 + 'px)'],
              'left': [this.rect.left + 'px', 'calc(50vw - ' + (this.depth - 1) * this.inset + 'px)'],
              'top': [this.rect.top + 'px', 'calc(50vh - ' + (this.depth - 1) * this.inset + 'px)'],
              'transform': ['translate(0, 0)', 'translate(-50%, -50%)'],
              'overflow': ['hidden', 'auto']
            }, {
              duration: this.speed,
              fill: 'forwards',
              easing: this.easing
            });

            this.backdropAnimation.finished.then(function () {
              _this3.innerAnimation = _this3.content.animate({
                opacity: [0, 1],
                transform: ['translateY(-10px)', 'translateY(0)']
              }, {
                duration: 500,
                fill: 'forwards',
                easing: _this3.easing
              });

              _this3.innerAnimation.finished.then(function () {
                _this3.busy = false;
              });
            });
          }

          /**
           * Collapse
           */
          else {
              this.busy = true;
              this.dispatchEvent(new CustomEvent('collapse'));
              var card = this.content.children[0].assignedNodes()[0];
              ScrollTo(0, 500, card, function () {
                _this3.innerAnimation.reverse();
                _this3.innerAnimation.finished.then(function () {
                  _this3.backdropAnimation.reverse();
                  _this3.outerAnimation.reverse();
                  _this3.outerAnimation.finished.then(function () {
                    document.documentElement.style.overflowY = '';
                    _this3.inner.style.position = 'absolute';
                    _this3.style.zIndex = 1;
                    document.body.classList.remove('has-fullscreen-teaser-expander');
                    _this3.busy = false;
                    window.teaserExpanders.splice(window.teaserExpanders.length - 1);
                    _this3.applyUrl();
                  });
                });
              });
            }
        }
      }
    }, {
      key: 'applyUrl',
      value: function applyUrl() {
        var url = '#';
        window.teaserExpanders.forEach(function (teaserExpander) {
          url += '/' + teaserExpander.dataset.popupId;
        });

        history.pushState(null, '', url);
      }
    }, {
      key: 'connectedCallback',
      value: function connectedCallback() {
        this.tabIndex = 0;
        this.inner.style.backgroundImage = 'url(' + this.getAttribute('image') + ')';
        // let rect = this.getBoundingClientRect();

        // this.inner.style.width = rect.width + 'px';
        // this.inner.style.height = rect.height + 'px';

        if (location.hash.substr(2) === this.dataset.popupId) {
          this.expanded = true;
        }
      }
    }, {
      key: 'expanded',
      get: function get() {
        return this.getAttribute('expanded') !== null;
      },
      set: function set(value) {
        value ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
      }
    }, {
      key: 'busy',
      get: function get() {
        return this.getAttribute('busy') !== null;
      },
      set: function set(value) {
        value ? this.setAttribute('busy', '') : this.removeAttribute('busy');
      }
    }]);

    return TeaserExpander;
  }(HTMLElement));

  var aboutToggle = document.querySelector('.about-me-button');

  var closeAbout = function closeAbout() {
      document.body.classList.remove('has-open-about');
      aboutToggle.innerHTML = 'about';
      aboutToggle.dataset.mouseClass = 'info';
      history.pushState(null, '', '#');
  };

  var openAbout = function openAbout() {
      document.body.classList.add('has-open-about');
      aboutToggle.innerHTML = 'close';
      aboutToggle.dataset.mouseClass = 'close';
      history.pushState(null, '', '#about');
  };

  document.addEventListener('keyup', function (event) {
      if (event.key === 'Escape' && document.body.classList.contains('has-open-about')) {
          closeAbout();
      }
  });

  aboutToggle.addEventListener('click', function () {
      if (document.body.classList.contains('has-open-about')) {
          closeAbout();
      } else {
          openAbout();
      }
  });

  if (location.hash === '#about') {
      openAbout();
  }

  var closeAboutButton = document.querySelector('.close-about');

  closeAboutButton.addEventListener('click', function () {
      closeAbout();
  });

  Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=build.js.map