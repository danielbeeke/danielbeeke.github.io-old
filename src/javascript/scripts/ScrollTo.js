export default function ScrollTo (elementY, duration, scrollWrapper = window, callback = false) {

  let startingY = scrollWrapper === window ? scrollWrapper.pageYOffset : scrollWrapper.scrollTop;
  let diff = elementY - startingY;
  let start;

  if (!diff && typeof callback === 'function'){
    return callback()
  }

  // Bootstrap our animation - it will get called right before next frame shall be rendered.
  let step = function (timestamp) {
    if (!start) start = timestamp;
    // Elapsed milliseconds since start of scrolling.
    let time = timestamp - start;
    // Get percent of completion in range [0, 1].
    let percent = Math.min(time / duration, 1);

    scrollWrapper.scrollTo(0, Math.round(startingY + diff * percent));

    // Proceed with animation as long as we wanted it to.
    if (time < duration) {
      window.requestAnimationFrame(step);
    }
    else if (typeof callback === 'function'){
      callback()
    }
  };

  window.requestAnimationFrame(step);
}