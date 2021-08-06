
function BackToTop ($module) {
  this.$module = $module;
}

BackToTop.prototype.init = function () {
  // Check if we can use Intersection Observers
  if (!('IntersectionObserver' in window)) {
    // If there's no support fallback to regular behaviour
    // Since JavaScript is enabled we can remove the default hidden state
    return this.$module.classList.remove('app-back-to-top--hidden');
  }

  var $footer = document.querySelector('.govuk-footer');

  // Check if there is anything to observe
  if (!$footer) {
    return;
  }

  var footerIsIntersecting = false;

  var observer = new window.IntersectionObserver(function (entries) {
    // Find the elements we care about from the entries
    var footerEntry = entries.find(function (entry) {
      return entry.target === $footer;
    });

    // If there is an entry this means the element has changed so lets check if it's intersecting.
    if (footerEntry) {
      footerIsIntersecting = footerEntry.isIntersecting;
    }

    // If the subnav or the footer not visible then fix the back to top link to follow the user
    if (footerIsIntersecting) {
      this.$module.classList.remove('floating-back-to-top--fixed');
    } else {
      this.$module.classList.add('floating-back-to-top--fixed');
    }
  }.bind(this));

  observer.observe($footer);
};

var $backToTop = document.querySelector('#back-to-top-button');
new BackToTop($backToTop).init();
