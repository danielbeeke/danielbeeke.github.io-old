export class Filters {
  constructor (app) {
    this.filters = document.querySelectorAll('.filter');
    this.app = app;

    Array.from(this.filters).forEach(filter => {
      filter.addEventListener('click', () => {
        let wasActive = filter.classList.contains('active');

        if (wasActive) {
          filter.classList.remove('active');
          filter.dataset.mouseClass = 'plus';
        }
        else {
          filter.classList.add('active');
          filter.dataset.mouseClass = 'minus';
        }

        this.updateShowcaseVisibility();
      });
    });
  }

  updateShowcaseVisibility () {
    let activeFilters = document.querySelectorAll('.filter.active');
    let activeCategories = Array.from(activeFilters).map(filter => filter.dataset.category);

    if (!activeCategories.length) {
      Array.from(this.filters).forEach(filter => {
        filter.classList.add('active');
        filter.dataset.mouseClass = 'minus';
      });

      return this.updateShowcaseVisibility();
    }

    document.body.classList.add('is-filtering-showcases');
    setTimeout(() => {
      document.body.classList.remove('is-filtering-showcases');
    }, 300);

    let showcases = document.querySelectorAll('.showcase');
    Array.from(showcases).forEach(showcase => {
      if (activeCategories.includes(showcase.dataset.category)) {
        showcase.classList.remove('hidden');
      }
      else {
        showcase.classList.add('hidden');
      }
    });

    this.app.counter.setCounters();

    setTimeout(() => {
      this.app.scroller.setScrollWidth();
    }, 1600);
  };
}