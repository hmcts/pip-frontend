import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/accessibility-statement';
const largeHeadingClass = 'govuk-heading-l';
const mediumHeadingClass = 'govuk-heading-m';
const smallHeadingClass = 'govuk-heading-s';
const bodyClass = 'govuk-body';

let htmlRes: Document;

describe('accessibility-statement', () => {
  beforeAll(async () => {
    await request(app).get(PAGE_URL).then(res => {
      htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
    });
  });

  it('should display the page header', () => {
    const header = htmlRes.getElementsByClassName(largeHeadingClass);

    expect(header[0].innerHTML).contains('Accessibility statement for the Court and Tribunal ' +
      'Hearing Information Service', 'Could not find the header');
  });

  it('should display the links in section 1', () => {
    const links = htmlRes.getElementsByTagName('a');

    expect(links[7].innerHTML).contains('www.court-tribunal-hearings.service.gov.uk.',
      'Could not find 1st section 1 link text');
    expect(links[7].href).contains('https://www.court-tribunal-hearings.service.gov.uk', 'Could not find 1st section 1 links href');

    expect(links[8].innerHTML).contains('AbilityNet', 'Could not find 2nd section 1 link text');
    expect(links[8].href).contains('https://mcmw.abilitynet.org.uk/', 'Could not find 2nd section 1 link href');
  });

  it('should display the heading in section 2', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[0].innerHTML).contains('How accessible is this website?', 'Could not find section 2 heading');
  });

  it('should display the heading in section 3', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[1].innerHTML).contains('Feedback and contact information', 'Could not find section 3 heading');
  });

  it('should display the heading in section 4', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[2].innerHTML).contains('Reporting accessibility problems with this website', 'Could not find section 4 heading');
  });

  it('should display the heading in section 5', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[3].innerHTML).contains('Enforcement procedure', 'Could not find section 5 heading');
  });

  it('should display the heading in section 6', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[4].innerHTML).contains('Contacting us by phone or visiting us in person', 'Could not find section 6 heading');
  });

  it('should display the heading in section 7', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[5].innerHTML).contains('Technical information about this website’s accessibility', 'Could not find section 7 heading');
  });

  it('should display the headings in section 8', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);
    const smallHeading = htmlRes.getElementsByClassName(smallHeadingClass);
    expect(heading[6].innerHTML).contains('Compliance status', 'Could find find section 8 heading');
    expect(smallHeading[0].innerHTML).contains('Non-accessible content', 'Could not find section 8 small heading');
  });

  it('should display the heading in section 9', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[7].innerHTML).contains('What we’re doing to improve accessibility', 'Could not find section 9 heading');
  });

  it('should display the heading in section 10', () => {
    const heading = htmlRes.getElementsByClassName(mediumHeadingClass);

    expect(heading[8].innerHTML).contains('Preparation of this accessibility statement', 'Could not find section 10 heading');
  });
});
