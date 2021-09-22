import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/status-description';

let htmlRes: Document;

describe('Status Description page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href')).equal('/', 'Back value does not contain correct link');
  });

  it('should contain the glossary of terms', () => {
    const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(pageHeading[0].innerHTML).contains('Live hearing updates - glossary of terms', 'Page heading does not exist');
  });

  it('should contain letters that link to court events status', () => {
    const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-visited-state');

    expect(alphabeticalLetters[0].innerHTML).contains('A', 'Alphabetical link is not present');
    expect(alphabeticalLetters[0].getAttribute('href')).equal('#A');
  });

  it('should contain the correct headers', () => {
    const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeaders[1].innerHTML).contains('Hearing status', 'Court or tribunal header is not present');
    expect(tableHeaders[2].innerHTML).contains('Description', 'Number of hearings header is not present');
  });

  it('should contain the letter names in rows are present', () => {
    for (let i = 0; i < 2; i++) {
      const letter = String.fromCharCode(65 + i);
      const row = htmlRes.getElementById(letter);
      expect(row.innerHTML).contains(letter);
    }
  });

  it('should have the first cell containing Adjourned', () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[0].innerHTML).contains('Adjourned');
  });
});
