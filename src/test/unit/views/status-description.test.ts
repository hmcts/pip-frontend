import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';

const PAGE_URL = '/status-description';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/StatusDescription.json'), 'utf-8');
const statusDescriptionData = JSON.parse(rawData).results;

jest.mock('axios', () => {
  return {
    create: function(): { get: () => Promise<any> } {
      return {
        get: function(): Promise<any> {
          return new Promise((resolve) => resolve({data: statusDescriptionData}));
        },
      };
    },
  };
});

describe('Status Description page', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display a back button with the correct value', () => {
    const backLink = htmlRes.getElementsByClassName('govuk-back-link');
    expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
    expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
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
    expect(tableHeaders[1].innerHTML).contains('Hearing status', 'Hearing status for the cases');
    expect(tableHeaders[2].innerHTML).contains('Description', 'Description for case status');
  });

  it('should contain the alphabets in rows are present', () => {
    for (let i = 0; i < 4; i++) {
      const letter = String.fromCharCode(65 + i);
      const row = htmlRes.getElementById(letter);
      expect(row.innerHTML).contains(letter);
    }
  });

  it('should have the first cell containing Adjourned', () => {
    const cell = htmlRes.getElementsByClassName('govuk-table__cell');
    expect(cell[0].innerHTML).contains('Adjourned');
    expect(cell[1].innerHTML).contains('The case has been adjourned.');
  });
});
