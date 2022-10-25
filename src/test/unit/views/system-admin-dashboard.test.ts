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
      .contains('System Dashboard', 'Could not find correct value in header');
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

});
