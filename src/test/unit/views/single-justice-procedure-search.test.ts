import {expect} from 'chai';
import request from 'supertest';

import {app} from '../../../main/app';

const PAGE_URL = '/single-justice-procedure-search';

let htmlRes: Document;

describe('Single Justice Procedure Search Page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(header[0].innerHTML).contains('Single Justice Procedure case', 'Could not find correct value in header');
  });
});
