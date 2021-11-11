import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/warned-list';
const backClass = 'govuk-back-link';
const headingClass = 'govuk-heading-l';
const mediumHeadingClass = 'govuk-heading-m';

let htmlRes: Document;

describe('Warned List Page', () => {
  beforeAll(async () => {
    app.request['user'] = {id: 1};
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display back button with the correct value',  () => {
    const backLink = htmlRes.getElementsByClassName(backClass);
    expect(backLink[0].innerHTML)
      .contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href'))
      .equal('#', 'Back value does not contain correct link');
  });

  it('should display court-header with the correct value',  () => {
    const headingList = htmlRes.getElementsByClassName(headingClass);
    expect(headingList[0].innerHTML)
      .contains('Derby Crown Court:', 'Heading does not contain correct court name');
  });

  it('should display for-pre-trial-review header with the correct value',  () => {
    const headingList = htmlRes.getElementsByClassName(mediumHeadingClass);
    expect(headingList[1].innerHTML)
      .contains('For Pre-Trial Review', 'For Pre-Trial review header does not contain correct value');
  });

  it('should display for-trial header with the correct value',  () => {
    const headingList = htmlRes.getElementsByClassName(mediumHeadingClass);
    expect(headingList[2].innerHTML)
      .contains('For Trial', 'For Trial heading does not contain correct value');
  });

  it('should display for-sentence header with the correct value',  () => {
    const headingList = htmlRes.getElementsByClassName(mediumHeadingClass);
    expect(headingList[4].innerHTML)
      .contains('For Sentence', 'For Sentence heading does not contain correct value');
  });

});
