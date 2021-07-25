import { Debounce } from './Debounce.js';

export class HorizontalScrolling {

  constructor(app, element) {
    this.element = element;
    this.realScrollDiv = document.createElement('div');
    this.element.before(this.realScrollDiv);
    this.realScrollDiv.style.width = '100vw';
    this.element.style.position = 'fixed';
    this.element.style.top = 0 + 'px';
    this.isFixingHorizontal = false;
    this.isFixingVertical = false;
    this.scroll = [];
    this.setScrollWidth();

    this.mouseDownX = null

    window.addEventListener('resize', () => {
      this.setScrollWidth();
    });

    this.element.addEventListener('mousedown', (event) => {
      this.mouseDownX = null
      this.isDragging = true
    })

    this.element.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        const delta = this.mouseDownX !== null ? this.mouseDownX - event.clientX : 0
        this.mouseDownX = event.clientX

        this.element.scrollTo({
          left: this.element.scrollLeft + delta,
          top: 0
        })
      }
    })

    this.element.addEventListener('click', (event) => {
      if (this.isDragging && this.mouseDownX !== null) {
        event.stopPropagation()
        event.preventDefault()  
      }

      this.isDragging = false
      this.mouseDownX = null

    }, {
      capture: true
    })

    document.addEventListener("mouseout", function() {
      let e = event, t = e.relatedTarget || e.toElement;
      if (!t || t.nodeName == "HTML") {
        this.isDragging = false
        this.mouseDownX = null
      }
  });
  
    
    window.addEventListener('scroll', (event) => {
      if (
        document.body.classList.contains('has-fullscreen-showcase') ||
        document.body.classList.contains('has-open-about')
      ) {
        event.preventDefault();
        return;
      }
      if (!this.isFixingHorizontal) {
        this.isFixingVertical = true;
        this.element.scrollLeft = window.scrollY;
        this.isFixingVertical = false;
      }

      if (this.element.scrollLeft === this.element.scrollWidth - this.element.offsetWidth) {
        document.body.classList.add('scrolled-to-end')
      }
      else {
        document.body.classList.remove('scrolled-to-end')
      }
    });

    let restore = Debounce(() => {
      this.isFixingHorizontal = true;
      window.scrollTo(0, this.element.scrollLeft);
      this.isFixingHorizontal = false;
    }, 100);

    this.element.addEventListener('scroll', (event) => {
      if (!this.isFixingVertical) {
        restore();
      }

      if (this.scroll.length) {
        this.scroll.forEach(callback => {
          if (typeof callback === 'function') {
            callback();
          }
        })
      }
    });
  }

  setScrollWidth () {
    let doIt = () => {
      this.realScrollDiv.style.height = this.element.scrollWidth - (window.innerWidth - window.innerHeight) + 'px';
    };

    setTimeout(() => {
      doIt();
    }, 1600);

    doIt();
  }

}

