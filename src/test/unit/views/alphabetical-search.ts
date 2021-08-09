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

  it('should contain the find a court heading', () => {
    const pageHeading = htmlRes.getElementsByClassName('govuk-heading-l');
    expect(pageHeading[0].innerHTML).contains('Find a court or tribunal listing', 'Page heading does not exist');
  });

  it('should contain letters that navigate to other sections of the page', () => {
    const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-visited-state');

    expect(alphabeticalLetters[0].innerHTML).contains('A', 'Alphabetical link is not present');
    expect(alphabeticalLetters[0].getAttribute('href')).equal('#A');
  });

  it('should contain no link if letter has no hearings', () => {
    const alphabeticalLetters = htmlRes.getElementsByClassName('govuk-link--no-underline');

    expect(alphabeticalLetters[1].innerHTML).contains('I', 'Alphabetical link is not present');
    expect(alphabeticalLetters[1].getAttribute('href')).not.exist;
  });

  it('should contain no hearings text', () => {
    const noHearings = htmlRes.getElementById('I').parentNode.parentNode as Element;

    expect(noHearings.innerHTML).contains('No hearings are scheduled in any of these', 'No hearings list not present');
    expect(noHearings.innerHTML).contains('locations today', 'No hearings list not present');
  });

  it('should contain the correct headers', () => {
    const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
    expect(tableHeaders[1].innerHTML).contains('Court or tribunal', 'Court or tribunal header is not present');
    expect(tableHeaders[2].innerHTML).contains('Number of hearings', 'Number of hearings header is not present');
  });

  it('should contain the letter names in rows are present', () => {
    for (let i = 0; i < 26; i++) {
      const letter = String.fromCharCode(65 + i);
      const row = htmlRes.getElementById(letter);
      expect(row.innerHTML).contains(letter);
    }
  });

  it('should have the first cell containing Albertville Court', () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[0].innerHTML).contains('Albertville Court');
  });

  it('should contain a back to top link, that links back up to the top', () => {
    const backToTopButton = htmlRes.getElementById('back-to-top-button');
    expect(backToTopButton.innerHTML).contains('Back to top');
    expect(backToTopButton.getAttribute('href')).contains('#');
  });

});
