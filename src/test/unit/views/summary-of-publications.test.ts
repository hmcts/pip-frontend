import request from 'supertest';
import {app} from '../../../main/app';
import {expect} from 'chai';

describe('Summary of publications page', () => {

  let htmlRes: Document;

  const bodyClass = 'govuk-body';

  describe('SJP Summary of Pubs', () => {
    const PAGE_URL = '/summary-of-publications?locationId=9';

    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display the custom SJP message', () => {
      const body = htmlRes.getElementsByClassName(bodyClass);
      expect(body[4].innerHTML).contains('Sorry, the Single Justice Procedure public court lists are temporarily not available. Please contact the Courts and Tribunals Service Centre on 0300 303 0656 for more information.',
        'SJP message is not displayed');
    });

  });

  describe('Non SJP Summary of Pubs', () => {
    const PAGE_URL = '/summary-of-publications?locationId=8';
    beforeAll(async () => {
      await request(app).get(PAGE_URL).then(res => {
        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      });
    });

    it('should display the non SJP message', () => {
      const body = htmlRes.getElementsByClassName(bodyClass);
      expect(body[4].innerHTML).contains('Sorry, no lists found for this court',
        'Non SJP is not displayed');
    });

  });

});
