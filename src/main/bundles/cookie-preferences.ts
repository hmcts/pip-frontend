import Cookies from 'js-cookie';
import { CookiePolicy } from '../models/CookiePolicy';
import {analyticsCookies, cookiePolicyName, performanceCookies} from '../models/consts';

const cookieBanner = document.getElementById('cookie-banner');
const cookieBannerMessage = document.getElementById('cookie-banner-message');
const acceptButton = document.getElementById('cookie-accept-analytics');
const acceptedMessage = document.getElementById('accept-message');
const rejectedButton = document.getElementById('cookie-reject-analytics');
const rejectedMessage = document.getElementById('reject-message');
const hideAcceptMessage = document.getElementById('hide-message-accept');
const hideRejectMessage = document.getElementById('hide-message-reject');
const cookiePolicyPageButton = document.getElementById('cookie-save-button');

const analyticsCookiesRadioButton = document.getElementById('analytics-cookies-options') as HTMLInputElement;
const performanceCookiesRadioButton = document.getElementById('performance-cookies-options') as HTMLInputElement;

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
  Cookies.set(cookiePolicyName, JSON.stringify(new CookiePolicy(value, value)), { expires: 365, path: '/', secure: true});
  cookieBannerMessage.hidden = true;

  if(value) {
    acceptedMessage.hidden = false;
  } else {
    rejectedMessage.hidden = false;
  }
}

function updateCookiePolicy(field, value) {
  const cookieValues = JSON.parse(Cookies.get(cookiePolicyName));

  if(field === 'performance') {
    cookieValues.performance = value;
  } else if (field === 'analytics') {
    cookieValues.analytics = value;
  }
  Cookies.set(cookiePolicyName, JSON.stringify(cookieValues), { expires: 365, path: '/', secure: true});
}

function checkCookie() {
  const cookiePolicy = Cookies.get(cookiePolicyName);

  if (cookiePolicy === undefined) {
    cookieBanner.hidden = false;
  } else {
    const cookieValues = JSON.parse(cookiePolicy) as CookiePolicy;

    if(cookieValues.analytics === false) {
      removeCookies(analyticsCookies);
    }

    if(cookieValues.performance === false) {
      removeCookies(performanceCookies);
    }
  }
}

function removeCookies(cookies: string[]) {
  cookies.forEach(cookie => {
    Cookies.remove(cookie);
  });
}
