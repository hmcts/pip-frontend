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

function setCookie(cname, cvalue, removeCookie) {
  const expiryDays = 365;
  let d = '';

  if(removeCookie) {
    d = new Date(null);
  } else {
    d = new Date();
    d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  }
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/;Secure=true`;
}

function getCookie(cname) {
  let name = cname + '=';
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let item of ca) {
    while (item.charAt(0) == ' ') {
      item = item.substring(1);
    }
    if (item.indexOf(name) == 0) {
      return item.substring(name.length, item.length);
    }
  }
  return '';
}

function setInitialCookiePolicy(value) {
  let cookieValue = JSON.stringify({
    essential: true,
    analytics: value,
    performance: value,
  });

  setCookie(cookieName, cookieValue, false);
  cookieBannerMessage.hidden = true;

  if(value) {
    acceptedMessage.hidden = false;
  } else {
    rejectedMessage.hidden = false;
  }
}

function updateCookiePolicy(field, value) {
  let cookieValues = JSON.parse(getCookie(cookieName));
  if(field === 'performance') {
    cookieValues.performance = value;
  } else if (field === 'analytics') {
    cookieValues.analytics = value;
  }
  setCookie(cookieName, JSON.stringify(cookieValues), false);
}

function checkCookie() {
  const cookiePolicy = getCookie(cookieName);
  let cookieValues = '';
  if(cookiePolicy.length > 1) {
    cookieValues = JSON.parse(cookiePolicy);
  }

  if (cookiePolicy === '') {
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
    setCookie(cookie, '', true);
  });
}

function removePerformanceNonEssentialCookies() {
  ['dtCookie', 'dtLatC', 'dtPC', 'dtSa', 'rxVisitor', 'rxvt'].forEach(cookie => {
    setCookie(cookie, '', true);
  });
}
