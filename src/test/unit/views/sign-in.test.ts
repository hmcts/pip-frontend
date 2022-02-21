import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/sign-in';
const headingClass = 'govuk-fieldset__heading';
const buttonClass = 'govuk-button';
const errorSummaryClass = 'govuk-error-summary';
const radioClass = 'govuk-radios__item';
const expectedHeader = 'How do you want to sign in?';
const expectedButtonText = 'Continue';
const expectedRadioLabel = ['With My HMCTS account','With Common Platform account','With a Court and tribunal hearings account'];

let htmlRes: Document;

describe('Sign In option Page', () => {
  describe('without error state', () => {
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display header',  () => {
      const header = htmlRes.getElementsByClassName(headingClass);
      expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should not display error summary', () => {
      const errorSummary = htmlRes.getElementsByClassName(errorSummaryClass);
      expect(errorSummary.length).to.equal(0);
    });

    it('should display continue button',  () => {
      const buttons = htmlRes.getElementsByClassName(buttonClass);
      expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });

    it('should display 3 radio buttons', () => {
      const radioButtons = htmlRes.getElementsByClassName(radioClass);
      expect(radioButtons.length).equal(3, '3 radio buttons not found');
    });

    it('should display radio button content',  () => {
      const radioButtons = htmlRes.getElementsByClassName(radioClass);
      for(let i = 0; i < 3; i++) {
        expect(radioButtons[i].innerHTML).contains(expectedRadioLabel[i], 'Could not find the radio button with label ' + expectedRadioLabel[i]);
      }
    });

    it('should display request account message', () => {
      const message = htmlRes.getElementsByClassName('govuk-body-s');
      expect(message[0].innerHTML).contains('Don\'t have an account?', 'Could not find request account message');
    });

    it('should display request account link', () => {
      const requestAccLink = htmlRes.getElementsByClassName('govuk-link');
      expect(requestAccLink[0].innerHTML).contains('Create a Court and tribunal hearings account', 'Could not find request account link');
      expect(requestAccLink[0].getAttribute('href')).contains('create-media-account', 'Link does not contain correct url');
    });
  });

  describe('with error state', () => {
    beforeAll(async () => {
      await request(app).get(`${PAGE_URL}?error=true`).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display error summary with appropriate message', () => {
      const errorSummary = htmlRes.getElementsByClassName(errorSummaryClass);
      expect(errorSummary[0].getElementsByTagName('h2')[0].innerHTML)
        .contains('There is a problem', 'Could not find error summary title');
      expect(errorSummary[0].getElementsByTagName('li')[0].innerHTML)
        .contains('Please select an option', 'Could not find error message');
    });
  });
});
