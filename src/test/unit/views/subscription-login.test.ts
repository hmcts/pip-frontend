import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/subscription-login';

const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Subscription Email Login Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Enter your email address', 'Could not find correct value in header');
  });

  it('should ask the user to enter their email address', () => {
    const passcodeText = htmlRes.getElementsByClassName('govuk-heading-s');
    expect(passcodeText[0].innerHTML).contains('Enter your email address', 'Could not find the enter the passcode header');
  });

  it('should display a text input where the user can enter their email address', () => {
    const input = htmlRes.getElementById('email-address');
    expect(input).exist;
  });

  it('should display the continue button', () => {
    const continueButton = htmlRes.getElementsByClassName(buttonClass);
    expect(continueButton[0].innerHTML).contains('Continue', 'Could not find continue button');
  });
});
