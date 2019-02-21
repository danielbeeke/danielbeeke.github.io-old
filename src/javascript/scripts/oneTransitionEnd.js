/**
 * Returns the name of the transitionend event.
 * @returns {*}
 */
function whichTransitionEvent() {
  let t,
    el = document.createElement("fakeelement");

  let transitions = {
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

let transitionEndType = whichTransitionEvent();

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
HTMLElement.prototype.oneTransitionEnd = function(property, callback, cssClassName = false) {
  if (transitionEndType) {
    let innerCallback = (event) => {
      if (event.propertyName.substr(-(property.length)) === property && event.target === this) {
        callback();
        this.removeEventListener(transitionEndType, innerCallback);
      }
    };

    this.addEventListener(transitionEndType, innerCallback);
  } else {
    callback();
  }

  return this;
};
