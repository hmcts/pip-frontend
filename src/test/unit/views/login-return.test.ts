import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';

const PAGE_URL = '/login/return';

const navigationClass = 'moj-sub-navigation__link';
const expectedHeader = 'Home';

let htmlRes: Document;

describe('Login return Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const navigation = htmlRes.getElementsByClassName(navigationClass);
    expect(navigation[0].innerHTML).contains(expectedHeader, 'Could not find the header');
  });
});
