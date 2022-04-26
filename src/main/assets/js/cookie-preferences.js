const cookieBanner = document.getElementById('cookie-banner');
const cookieBannerMessage = document.getElementById('cookie-banner-message');
const acceptButton = document.getElementById('cookie-accept-analytics');
const acceptedMessage = document.getElementById('accept-message');
const rejectedButton = document.getElementById('cookie-reject-analytics');
const rejectedMessage = document.getElementById('reject-message');
const hideAcceptMessage = document.getElementById('hide-message-accept');
const hideRejectMessage = document.getElementById('hide-message-reject');

const cookieName = 'cookiePolicy';

(function () {
  checkCookie();
}).call(this);

acceptButton.onclick = () => {
  setAcceptCookies();
};

rejectedButton.onclick = () => {
  setRejectCookies();
};

hideAcceptMessage.onclick = () => {
  cookieBanner.hidden = true;
};

hideRejectMessage.onclick = () => {
  cookieBanner.hidden = true;
};

function setCookie(cname, cvalue) {
  const expiryDays = 365;
  const d = new Date();
  d.setTime(d.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/;Secure=true`;
}

function setAcceptCookies() {
  setCookie(cookieName, '{"essential":true, "analytics":true}');
  cookieBannerMessage.hidden = true;
  acceptedMessage.hidden = false;
}

function setRejectCookies() {
  setCookie(cookieName, '{"essential":true, "analytics":false}');
  cookieBannerMessage.hidden = true;
  rejectedMessage.hidden = false;
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

function getCookieChoiceValue(cookie) {
  const analytics = cookie.split(', ')[1];
  return analytics.substring((analytics.indexOf(':') + 1), (analytics.length -1));
}

function checkCookie() {
  const cookie_policy = getCookie(cookieName);

  if (cookie_policy == '') {
    cookieBanner.hidden = false;
  } else {
    if (getCookieChoiceValue(cookie_policy) == 'false') {
      removeNonEssentialCookies();
    }
  }
}

function removeNonEssentialCookies() {
  //add deletion of non essential cookies here
}
