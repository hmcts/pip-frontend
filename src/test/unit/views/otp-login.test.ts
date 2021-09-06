import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/otp-login';

const buttonClass = 'govuk-button';

let htmlRes: Document;

describe('Otp Login Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Verify your email address', 'Could not find correct value in header');
  });

  it('should ask the user to enter the 6 digit passcode', () => {
    const passcodeText = htmlRes.getElementsByClassName('govuk-heading-s');
    expect(passcodeText[0].innerHTML).contains('Enter your 6-digit passcode', 'Could not find the enter the passcode header');
  });

  it('should display how many attempts the user has left', () => {
    const attemptText = htmlRes.getElementsByClassName('govuk-body');
    expect(attemptText[0].innerHTML).contains('You have 3 attempts', 'Could not find the attempts text');
  });

  it('should display a text input where the user can enter a 6 digit passcode', () => {
    const input = htmlRes.getElementById('otp-code');
    expect(input).exist;
  });

  it('should display the continue button', () => {
    const continueButton = htmlRes.getElementsByClassName(buttonClass);
    expect(continueButton[0].innerHTML).contains('Continue', 'Could not find continue button');
  });

  it('should display the reset passcode button', () => {
    const resetPasscodeButton = htmlRes.getElementsByClassName(buttonClass);
    expect(resetPasscodeButton[1].innerHTML).contains('Resend passcode', 'Could not find Resend passcode button');
  });
});
