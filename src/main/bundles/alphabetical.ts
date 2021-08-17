
//Class to handle the BackToTop functionality for the Alphabetical page
export default class BackToTop {

  module: Element;

  constructor($module) {
    this.module = $module;
  }

  checkIfFooterVisible(currentThis, $footer): void {
    const rectangle = $footer.getBoundingClientRect();
    const viewPortHeight = window.innerHeight || document.documentElement.clientHeight;

    if (viewPortHeight - rectangle.top > 0) {
      currentThis.module.classList.remove('floating-back-to-top--fixed');
    } else {
      currentThis.module.classList.add('floating-back-to-top--fixed');
    }
  }

  public init(): void {
    const $footer = document.querySelector('.govuk-footer');

    // Check if there is anything to observe
    if (!$footer) {
      return;
    }
    // Check if we can use Intersection Observers
    // If not enabled (e.g IE11), then we default to using scroll listeners
    if (!('IntersectionObserver' in window)) {
      this.checkIfFooterVisible(this, $footer);
      document.addEventListener('scroll', function(): void {
        this.checkIfFooterVisible(this, $footer);
      }.bind(this));

    } else {
      let footerIsIntersecting = false;

      const observer = new window.IntersectionObserver(function (entries): void {
        // Find the elements we care about from the entries
        const footerEntry = entries.find(function (entry) {
          return entry.target === $footer;
        });

        // If there is an entry this means the element has changed so lets check if it's intersecting.
        if (footerEntry) {
          footerIsIntersecting = footerEntry.isIntersecting;
        }

        // If the subnav or the footer not visible then fix the back to top link to follow the user
        if (footerIsIntersecting) {
          this.module.classList.remove('floating-back-to-top--fixed');
        } else {
          this.module.classList.add('floating-back-to-top--fixed');
        }
      }.bind(this));

      observer.observe($footer);
    }
  }
}

const $backToTop = document.querySelector('#back-to-top-button');
new BackToTop($backToTop).init();


