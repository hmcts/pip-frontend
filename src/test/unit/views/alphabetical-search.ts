import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/alphabetical-search';

let htmlRes: Document;

describe('Alphabetical Search page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href')).equal('/search-option', 'Back value does not contain correct link');
  });
});
