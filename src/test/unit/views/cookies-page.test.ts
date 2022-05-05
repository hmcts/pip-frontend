import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/cookie-policy';
const headingClass = 'govuk-heading-l';
const tableCaptionClass = 'govuk-table__caption';
const tableCellClass = 'govuk-table';
const tableRow = 'govuk-table__row';
const mediumHeadingClass = 'govuk-heading-m';
const bodyClass = 'govuk-body';

let htmlRes: Document;

describe('Cookies page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
      htmlRes.getElementsByTagName('div')[0].remove();
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(headingClass);
    expect(header[0].innerHTML).contains('Cookies', 'Could not find the header');
  });

  it('should display first cookies explanation text', () => {
    const cookiesExplanationText = htmlRes.getElementsByClassName(bodyClass);
    expect(cookiesExplanationText[0].innerHTML).contains('Cookies are small files saved on your phone, ' +
      'tablet or computer when you visit a website.',
    'Could not find first cookies explanation text');
  });

  it('should display second cookies explanation text', () => {
    const cookiesExplanationText = htmlRes.getElementsByClassName(bodyClass);
    expect(cookiesExplanationText[1].innerHTML).contains('We use cookies to make Court and Tribunal Hearings ' +
      'work and collect information about how you use our service.',
    'Could not find second cookies explanation text');
  });

  it('should display third cookies explanation text', () => {
    const cookiesExplanationText = htmlRes.getElementsByClassName(bodyClass);
    expect(cookiesExplanationText[2].innerHTML).contains('Essential cookies keep your information secure ' +
      'while you use Courts and Tribunal Hearings. We do not need to ask permission to use them.',
    'Could not find third cookies explanation text');
  });

  it('should display table caption', () =>{
    const tableCaption = htmlRes.getElementsByClassName(tableCaptionClass);
    expect(tableCaption[0].innerHTML).contains('Essential Cookies', 'Table caption not rendered');
  });

  it('should display table cells', () =>{
    const table = htmlRes.getElementsByClassName(tableCellClass);
    expect(table[0].innerHTML).contains('session', 'Table cells not rendered');
  });

  it('should display 4 essential cookies', () => {
    const tableRows = htmlRes.getElementsByClassName(tableRow);
    expect(tableRows.length).to.equal(5, 'Incorrect number of rows including header');
  });

  it('should display analytics header', () => {
    const analyticsHeader = htmlRes.getElementsByClassName(mediumHeadingClass);
    expect(analyticsHeader[0].innerHTML).contains('Analytics Cookies', 'Could not find the analytics header');
  });

  it('should display first analytics explanation text', () => {
    const analyticsExplanationText = htmlRes.getElementsByClassName(bodyClass);
    expect(analyticsExplanationText[3].innerHTML).contains('With your permission, we use Google Analytics ' +
      'and Dynatrace to collect data about how you use this service. ' +
      'This information helps us to improve our service.', 'Could not find first analytics explanation text');
  });
});
