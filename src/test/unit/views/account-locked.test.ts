import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/account-locked';
const headingClass = 'govuk-heading-l';

let htmlRes: Document;
describe('Account Locked page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Your account has been locked', 'Could not find the header');
  });
});

