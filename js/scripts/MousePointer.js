export class MousePointer {

  constructor (app) {
    this.pointer = document.querySelector('.mouse-pointer');
    this.event = false;
    this.clickTimeout = false;
    document.body.classList.add('pointer-swap');

    window.addEventListener('mousemove', (event) => {
      this.updateMouseVisual(event);
    });

    window.addEventListener('mousedown',(event) => {
      document.body.classList.add('is-clicking');
    });

    window.addEventListener('mouseup',(event) => {
      document.body.classList.remove('is-clicking');
    });

    window.addEventListener('click',(event) => {
      document.body.classList.add('is-clicking');

      if (this.clickTimeout) {
        clearTimeout(this.clickTimeout);
      }

      this.clickTimeout = setTimeout(() => {
        document.body.classList.remove('is-clicking');
      }, 100);
    });

    setInterval(() => {
      let parent = false;
      let target = false;

      if (this.event && this.event.clientX &&  this.event.clientY) {
        target = document.elementFromPoint(this.event.clientX, this.event.clientY);
      }

      if (target && target.closest) {
        parent = target.closest('[data-mouse-class]');
      }

      if (target && target.nodeName === 'A') {
        document.body.dataset.mouse = 'link';
        return;
      }

      document.body.dataset.mouse = parent ? parent.dataset.mouseClass : '';
    }, 160);
  }

  updateMouseVisual (event) {
    this.pointer.style.transform = `translate(${event.clientX}px, ${event.clientY}px)`;
    this.event = event;
  };
}