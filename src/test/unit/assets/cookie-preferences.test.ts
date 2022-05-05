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

cookieBanner.setAttribute('id', 'cookie-banner');
cookieBannerMessage.setAttribute('id', 'cookie-banner-message');
acceptButton.setAttribute('id', 'cookie-accept-analytics');
acceptedMessage.setAttribute('id', 'accept-message');
rejectedButton.setAttribute('id', 'cookie-reject-analytics');
rejectedMessage.setAttribute('id', 'reject-message');
hideAcceptMessage.setAttribute('id', 'hide-message-accept');
hideRejectMessage.setAttribute('id', 'hide-message-reject');

stub.withArgs('cookie-banner').returns(cookieBanner);
stub.withArgs('cookie-banner-message').returns(cookieBannerMessage);
stub.withArgs('cookie-accept-analytics').returns(acceptButton);
stub.withArgs('accept-message').returns(acceptedMessage);
stub.withArgs('cookie-reject-analytics').returns(rejectedButton);
stub.withArgs('reject-message').returns(rejectedMessage);
stub.withArgs('hide-message-accept').returns(hideAcceptMessage);
stub.withArgs('hide-message-reject').returns(hideRejectMessage);

describe('Cookie policy', () => {
  it('should display cookie banner if no cookie is set', async () => {
    cookieBanner.hidden = true;
    await import('../../../main/assets/js/cookie-preferences');
    expect(cookieBanner.hidden).toBeFalsy();
  });

  it('should keep default hidden cookie banner if cookie is set', async () => {
    cookieBanner.hidden = true;
    document.cookie = 'cookiePolicy={"essential":true, "analytics":true}';
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
      value: 'cookiePolicy={"essential":true, "analytics":false}',
    });
    await import('../../../main/assets/js/cookie-preferences');
    expect(cookieBanner.hidden).toBeTruthy();
  });
});
