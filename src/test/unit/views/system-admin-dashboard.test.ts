import {app} from '../../../main/app';
import request from 'supertest';
import {expect} from 'chai';

const PAGE_URL = '/system-admin-dashboard';

const pageTitleValue = 'System Admin dashboard';

let htmlRes: Document;

describe('System Admin Dashboard page', () => {

  beforeAll(async () => {
    app.request['user'] = {piUserId: '1', _json: {
      'extension_UserRole': 'SYSTEM_ADMIN',
    }};

    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should have correct page title', () => {
    const pageTitle = htmlRes.title;
    expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML)
      .contains('System Admin Dashboard', 'Could not find correct value in header');
  });

  it('should display 5 links in banner', () => {
    const bannerComponents = htmlRes.getElementsByClassName('moj-sub-navigation__link');
    expect(bannerComponents.length).equal(5);

    expect(bannerComponents[0].innerHTML).equal('Home');
    expect(bannerComponents[1].innerHTML).equal('Admin Dashboard');
    expect(bannerComponents[2].innerHTML).equal('Upload');
    expect(bannerComponents[3].innerHTML).equal('Remove');
    expect(bannerComponents[4].innerHTML).equal('Sign out');
  });

  it('should display 1 card option', () => {
    const cardComponents = htmlRes.getElementsByClassName('account-card');
    expect(cardComponents.length).equal(3);
  });

  it('card should have correct content and links', () => {
    const adminCards = htmlRes.getElementsByClassName('account-card');
    const link = adminCards[0].getElementsByTagName('a')[0];
    const description = adminCards[0].getElementsByTagName('p')[1];
    expect(link.innerHTML).contains('Create System Admin');
    expect(link.getAttribute('href')).contains('create-system-admin-account');
    expect(description.innerHTML).contains('Create a new system admin user');

  });

});
