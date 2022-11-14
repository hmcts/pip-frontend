//Class to handle the BackToTop functionality for the Alphabetical page
export default class BackToTop {
  module: Element;

  constructor($module) {
    this.module = $module;
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
      this.module.classList.add('floating-back-to-top--fixed');
      document.addEventListener(
        'scroll',
        function (): void {
          this.module.classList.add('floating-back-to-top--fixed');
        }.bind(this)
      );
    } else {
      const observer = new window.IntersectionObserver(
        function (): void {
          this.module.classList.add('floating-back-to-top--fixed');
        }.bind(this)
      );

      observer.observe($footer);
    }
  }
}
