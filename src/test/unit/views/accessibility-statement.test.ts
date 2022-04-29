import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/accessibility-statement';
const largeHeadingClass = 'govuk-heading-l';
// const mediumHeadingClass = 'govuk-heading-m';
// const smallHeadingClass = 'govuk-heading-s';
// const bodyClass = 'govuk-body';
const listClass = 'govuk-list';

let htmlRes: Document;

describe('accessibility-statement', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display header', () => {
    const header = htmlRes.getElementsByClassName(largeHeadingClass);
    expect(header[0].innerHTML).contains('Accessibility statement for the Court and Tribunal ' +
      'Hearing Information Service', 'Could not find the header');
  });
});
