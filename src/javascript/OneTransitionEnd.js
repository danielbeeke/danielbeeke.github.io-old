export default function OneTransitionEnd (element, cssProperty, className, operation = 'add') {
  return new Promise((resolve) => {

    let innerCallback = (event) => {
      if (event.propertyName === cssProperty) {
        element.removeEventListener('transitionend', innerCallback);
        resolve();
      }
    }

    setTimeout(() => {
      element.addEventListener('transitionend', innerCallback)
      element.classList[operation](className);
    });
  })
}
