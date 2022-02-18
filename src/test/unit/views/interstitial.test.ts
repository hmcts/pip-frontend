import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

let htmlRes: Document;
const PAGE_URL = '/interstitial';

describe('Interstitial page', () => {
  describe('with English translations', () => {
    beforeAll(async () => {
      app.request['lng'] = 'en';
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML).contains('Court and tribunal hearings', 'Could not find correct value in header');
    });

    it('should display continue button',  () => {
      const buttons = htmlRes.getElementsByClassName('govuk-button');
      expect(buttons[0].innerHTML).contains('Continue', 'Could not find button');
    });

    it('should display a message', () => {
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[0].innerHTML).contains('You can use this service to get information about:', 'Could not find a message');
    });

    it('should display bullets', () => {
      const bullets = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByTagName('li');
      expect(bullets[0].innerHTML).contains('hearings in Civil and Family Courts in [xx region]',
        'Could not find first bullet');
      expect(bullets[1].innerHTML).contains('Single Justice Procedure cases, including TV licensing and minor traffic offences such as speeding',
        'Could not find second bullet');
    });

    it('should display more courts message', () => {
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[2].innerHTML).contains('More courts and tribunals will become available over time.',
        'Could not find courts message');
    });

    it('should display legal sign in', () => {
      const signInMessage = htmlRes.getElementsByClassName('govuk-body');
      expect(signInMessage[3].innerHTML).contains('Legal and media professionals can',
        'Could not find sign in message');
    });

    it('should display Welsh service message', () => {
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[4].innerHTML).contains('This service is also available in',
        'Could not find language message');
    });
  });

  describe('with Welsh translations', () => {
    beforeAll(async () => {
      app.request['lng'] = 'cy';
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display header', () => {
      const header = htmlRes.getElementsByClassName('govuk-heading-l');
      expect(header[0].innerHTML).contains('Court and tribunal hearings', 'Could not find correct value in header');
    });

    it('should display continue button',  () => {
      const buttons = htmlRes.getElementsByClassName('govuk-button');
      expect(buttons[0].innerHTML).contains('Parhau', 'Could not find button');
    });

    it('should display Welsh service message', () => {
      const message = htmlRes.getElementsByClassName('govuk-body');
      expect(message[4].innerHTML).contains('Mae’r canllaw hwn hefyd ar gael yn',
        'Could not find language message');
    });
  });
});
