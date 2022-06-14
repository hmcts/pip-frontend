import sinon from 'sinon';

const stub = sinon.stub(document, 'getElementById');

const cookieBanner = document.createElement('div');
const cookieBannerMessage = document.createElement('div');
const acceptButton = document.createElement('button');
const acceptedMessage = document.createElement('div');
const rejectedButton = document.createElement('button');
const rejectedMessage = document.createElement('div');
const hideAcceptMessage = document.createElement('button');
const hideRejectMessage = document.createElement('button');
const cookiePolicyPageButton = document.createElement('button');
const analyticsCookiesRadioButton = document.createElement('input');
const performanceCookiesRadioButton = document.createElement('input');

cookieBanner.setAttribute('id', 'cookie-banner');
cookieBannerMessage.setAttribute('id', 'cookie-banner-message');
acceptButton.setAttribute('id', 'cookie-accept-analytics');
acceptedMessage.setAttribute('id', 'accept-message');
rejectedButton.setAttribute('id', 'cookie-reject-analytics');
rejectedMessage.setAttribute('id', 'reject-message');
hideAcceptMessage.setAttribute('id', 'hide-message-accept');
hideRejectMessage.setAttribute('id', 'hide-message-reject');
cookiePolicyPageButton.setAttribute('id', 'cookie-save-button');
analyticsCookiesRadioButton.setAttribute('id', 'analytics-cookies-options');
performanceCookiesRadioButton.setAttribute('id', 'performance-cookies-options');

stub.withArgs('cookie-banner').returns(cookieBanner);
stub.withArgs('cookie-banner-message').returns(cookieBannerMessage);
stub.withArgs('cookie-accept-analytics').returns(acceptButton);
stub.withArgs('accept-message').returns(acceptedMessage);
stub.withArgs('cookie-reject-analytics').returns(rejectedButton);
stub.withArgs('reject-message').returns(rejectedMessage);
stub.withArgs('hide-message-accept').returns(hideAcceptMessage);
stub.withArgs('hide-message-reject').returns(hideRejectMessage);
stub.withArgs('cookie-save-button').returns(cookiePolicyPageButton);
stub.withArgs('analytics-cookies-options').returns(analyticsCookiesRadioButton);
stub.withArgs('performance-cookies-options').returns(performanceCookiesRadioButton);

describe('Cookie policy', () => {
  it('should display cookie banner if no cookie is set', async () => {
    cookieBanner.hidden = true;
    await import('../../../main/assets/js/cookie-preferences');
    expect(cookieBanner.hidden).toBeFalsy();
  });

  it('should keep default hidden cookie banner if cookie is set', async () => {
    cookieBanner.hidden = true;
    document.cookie = 'cookiePolicy={"essential":true,"analytics":true,"performance":true}';
    await import('../../../main/assets/js/cookie-preferences');
    expect(cookieBanner.hidden).toBeTruthy();
  });

  it('should show accepted message on accept cookie click', async () => {
    await import('../../../main/assets/js/cookie-preferences');
    await acceptButton.click();
    expect(cookieBannerMessage.hidden).toBeTruthy();
    expect(acceptedMessage.hidden).toBeFalsy();
  });

  it('should show rejected message on reject cookie click', async () => {
    await import('../../../main/assets/js/cookie-preferences');
    await rejectedButton.click();
    expect(cookieBannerMessage.hidden).toBeTruthy();
    expect(rejectedMessage.hidden).toBeFalsy();
  });

  it('should hide banner once accepted hide message is clicked', async () => {
    cookieBanner.hidden = false;
    await import('../../../main/assets/js/cookie-preferences');
    await hideAcceptMessage.click();
    expect(cookieBanner.hidden).toBeTruthy();
  });

  it('should hide banner once rejected hide message is clicked', async () => {
    cookieBanner.hidden = false;
    await import('../../../main/assets/js/cookie-preferences');
    await hideRejectMessage.click();
    expect(cookieBanner.hidden).toBeTruthy();
  });

  it('should getCookie', async () => {
    cookieBanner.hidden = true;
    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'cookiePolicy={"essential":true,"analytics":false,"performance":false}',
    });
    await import('../../../main/assets/js/cookie-preferences');
    expect(cookieBanner.hidden).toBeTruthy();
  });

  it('should be able to update cookies from the radio buttons', async () => {
    await import('../../../main/assets/js/cookie-preferences');

    Object.defineProperty(document, 'cookie', {
      writable: true,
      value: 'cookiePolicy={"essential":true,"analytics":false,"performance":true}',
    });
    analyticsCookiesRadioButton.checked = true;
    performanceCookiesRadioButton.checked = false;
    await cookiePolicyPageButton.click();

    expect(document.cookie).toContain('"analytics":true');
    expect(document.cookie).toContain('"performance":false');
  });

  it('should delete an analytics cooke when analytics is disabled', async () => {
    // Register 2 cookies, the second should be deleted
    document.cookie = 'cookiePolicy={"essential":true,"analytics":false,"performance":true}';
    document.cookie = '_ga=1234';

    // Import the cookie preferences which should delete the _ga=1234 cookie as analytics is false
    await import('../../../main/assets/js/cookie-preferences');

    // Expect _ga=1234 not to be in the cookies as it should have been removed
    expect(document.cookie).not.toContain('_ga=1234');
  });
});
