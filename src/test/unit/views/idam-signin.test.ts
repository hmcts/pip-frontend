import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/idam-signin';

const buttonClass = 'govuk-button';

const linkClass = 'govuk-link';

let htmlRes: Document;

describe('Idam Signin Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Sign in to your account', 'Could not find correct value in header');
  });

  it('should display how to create an account information', () => {
    const attemptText = htmlRes.getElementsByClassName('govuk-body');
    expect(attemptText[1].innerHTML).contains('Already have an account? Please tell us which jurisdiction you are signed up with and we will then ask you to sign in.',
      'Could not find the attempts text');
  });

  it('should display a select menu where user can choose idam provider', () => {
    const input = htmlRes.getElementById('idam-select');
    expect(input).exist;
  });

  it('should display the continue button', () => {
    const continueButton = htmlRes.getElementsByClassName(buttonClass);
    expect(continueButton[0].innerHTML).contains('Continue', 'Could not find continue button');
  });

  it('should display the reset passcode button', () => {
    const resetPasscodeButton = htmlRes.getElementsByClassName(linkClass);
    expect(resetPasscodeButton[0].innerHTML).contains('create an account', 'Could not find create an account link');
  });
});
