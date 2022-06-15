const cookieBanner = document.getElementById('cookie-banner');
const cookieBannerMessage = document.getElementById('cookie-banner-message');
const acceptButton = document.getElementById('cookie-accept-analytics');
const acceptedMessage = document.getElementById('accept-message');
const rejectedButton = document.getElementById('cookie-reject-analytics');
const rejectedMessage = document.getElementById('reject-message');
const hideAcceptMessage = document.getElementById('hide-message-accept');
const hideRejectMessage = document.getElementById('hide-message-reject');
const cookiePolicyPageButton = document.getElementById('cookie-save-button');
const analyticsCookiesRadioButton = document.getElementById('analytics-cookies-options');
const performanceCookiesRadioButton = document.getElementById('performance-cookies-options');

const cookieName = 'cookiePolicy';

(function () {
  checkCookie();
}).call(this);

acceptButton.onclick = () => {
  setInitialCookiePolicy(true);
};

rejectedButton.onclick = () => {
  setInitialCookiePolicy(false);
};

hideAcceptMessage.onclick = () => {
  cookieBanner.hidden = true;
};

hideRejectMessage.onclick = () => {
  cookieBanner.hidden = true;
};

cookiePolicyPageButton.onclick = () => {
  updateCookiePolicy('analytics', analyticsCookiesRadioButton.checked);
  updateCookiePolicy('performance', performanceCookiesRadioButton.checked);
};

function setInitialCookiePolicy(value) {
  let cookieValue = JSON.stringify({
    essential: true,
    analytics: value,
    performance: value,
  });

  Cookies.set(cookieName, cookieValue, { expires: 365, path: '/', secure: true});
  cookieBannerMessage.hidden = true;

  if(value) {
    acceptedMessage.hidden = false;
  } else {
    rejectedMessage.hidden = false;
  }
}

function updateCookiePolicy(field, value) {
  let cookieValues = JSON.parse(Cookies.get(cookieName));

  if(field === 'performance') {
    cookieValues.performance = value;
  } else if (field === 'analytics') {
    cookieValues.analytics = value;
  }
  Cookies.set(cookieName, JSON.stringify(cookieValues), { expires: 365, path: '/', secure: true});
}

function checkCookie() {
  const cookiePolicy = Cookies.get(cookieName);
  let cookieValues = '';
  if(cookiePolicy !== undefined) {
    cookieValues = JSON.parse(cookiePolicy);
  }

  if (cookiePolicy === undefined) {
    cookieBanner.hidden = false;
  } else {
    if(cookieValues.analytics === false && cookieValues.performance === false) {
      removeAnalyticsNonEssentialCookies();
      removePerformanceNonEssentialCookies();
    } else if (cookieValues.analytics === false) {
      removeAnalyticsNonEssentialCookies();
    } else if (cookieValues.performance === false) {
      removePerformanceNonEssentialCookies();
    }
  }
}

function removeAnalyticsNonEssentialCookies() {
  ['_ga', '_gat', '_gid'].forEach(cookie => {
    Cookies.remove(cookie);
  });
}

function removePerformanceNonEssentialCookies() {
  ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'].forEach(cookie => {
    Cookies.remove(cookie);
  });
}
