export default function ScrollTo (elementY, duration, callback, scrollWrapper = window) {
  var startingY = scrollWrapper === window ? scrollWrapper.pageYOffset : scrollWrapper.scrollTop;
  var diff = elementY - startingY;
  var start;

  if (!diff && typeof callback === 'function'){
    callback()
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
    }
    else if (typeof callback === 'function'){
      callback()
    }
  })
}
