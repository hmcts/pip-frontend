import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';

const PAGE_URL = '/login/return';

const navigationClass = 'moj-sub-navigation__link';
const headerClass = 'govuk-heading-l';
const expectedHeaderMenu = 'Home';
const expectedHeader = 'You are logged in';

let htmlRes: Document;

describe('Login return Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header menu', () => {
    const navigation = htmlRes.getElementsByClassName(navigationClass);
    expect(navigation[0].innerHTML).contains(expectedHeaderMenu, 'Could not find the header');
  });

  it('should display header', () => {
    const navigation = htmlRes.getElementsByClassName(headerClass);
    expect(navigation[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });
});
