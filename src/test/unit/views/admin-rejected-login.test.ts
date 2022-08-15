import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('Admin rejected login page', () => {
  beforeAll(async () => {
    const PAGE_URL = '/admin-rejected-login';
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display the page header', () => {
    const header = htmlRes.getElementsByClassName(largeHeadingClass);
    expect(header[0].innerHTML).contains('Sign in rejected', 'Could not find the header');
  });

  it('should display the body text', () => {
    const bodyText = htmlRes.getElementsByClassName('govuk-body');
    expect(bodyText[4].innerHTML).contains('You have attempted to login following the wrong process.',
      'Could not find body text');
    expect(bodyText[5].innerHTML).contains('Please click the button below to sign in through the admin process.',
      'Could not find body text');
  });

  it('should display the button', () => {
    const button = htmlRes.getElementsByClassName('govuk-button');
    expect(button[4].textContent).contains('Sign in', 'Could not find button');
    expect(button[4].outerHTML).contains('B2C_1_SignInAdminUserFlow');
  });
});
