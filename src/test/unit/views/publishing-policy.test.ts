import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/publishing-policy';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('publishing-policy', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(
            'Publication policy - Court and Tribunal Hearings - GOV.UK',
            'Could not find the page title'
        );
    });

    it('should display the page header', () => {
        const header = htmlRes.getElementsByClassName(largeHeadingClass);

        expect(header[0].innerHTML).contains('Publication policy', 'Could not find the header');
    });

    it('should display the heading in section 1', () => {
        const div = htmlRes.getElementById('section1');

        expect(div.textContent).contains('1. Scope and aim', 'Could not find section 1 heading');
    });

    it('should display the heading in section 2', () => {
        const div = htmlRes.getElementById('section2');

        expect(div.textContent).contains('2. Background', 'Could not find section 2 heading');
    });

    it('should display the heading in section 3', () => {
        const div = htmlRes.getElementById('section3');

        expect(div.textContent).contains('3. Definitions and data categories', 'Could not find section 3 heading');
    });

    it('should display the heading in section 4', () => {
        const div = htmlRes.getElementById('section4');

        expect(div.textContent).contains(
            '4. Policy statement and publication principles',
            'Could not find section 4 heading'
        );
    });

    it('should display the heading in section 5', () => {
        const div = htmlRes.getElementById('section5');

        expect(div.textContent).contains('5. RPSI 2015 and licensing approach', 'Could not find section 5 heading');
    });

    it('should display the heading in section 6', () => {
        const div = htmlRes.getElementById('section6');

        expect(div.textContent).contains(
            '6. Enhanced information: access and re-use',
            'Could not find section 6 heading'
        );
    });

    it('should display the heading in section 7', () => {
        const div = htmlRes.getElementById('section7');

        expect(div.textContent).contains(
            '7. Onward sharing and third-party access',
            'Could not find section 7 heading'
        );
    });

    it('should display the heading in section 8', () => {
        const div = htmlRes.getElementById('section8');

        expect(div.textContent).contains('8. Governance and decision-making', 'Could not find section 8 heading');
    });

    it('should display the heading in section 9', () => {
        const div = htmlRes.getElementById('section9');

        expect(div.textContent).contains('9. Compliance, monitoring and review', 'Could not find section 9 heading');
    });

    it('should display the heading in section 10', () => {
        const div = htmlRes.getElementById('section10');

        expect(div.textContent).contains('10. Reporting and review', 'Could not find section 10 heading');
    });

    it('should display the policy links with correct href values', () => {
        const links = Array.from(htmlRes.getElementsByTagName('a'));
        const expectedLinks = [
            {
                text: 'The Re-use of Public Sector Information Regulations 2015',
                href: 'https://www.legislation.gov.uk/uksi/2015/1415/contents',
            },
            {
                text: 'Get access to HMCTS data',
                href: 'https://www.gov.uk/guidance/access-hmcts-data-for-research',
            },
            {
                text: 'Apply for an HMCTS Third-Party Courts and Tribunals Data Licence',
                href: 'https://www.gov.uk/guidance/apply-for-an-hmcts-third-party-courts-and-tribunals-data-licence',
            },
            {
                text: 'Protocol on sharing court lists, registers and documents with the media (accessible version) - GOV.UK',
                href: 'https://www.gov.uk/government/publications/guidance-to-staff-on-supporting-media-access-to-courts-and-tribunals/protocol-on-sharing-court-lists-registers-and-documents-with-the-media-accessible-version',
            },
            {
                text: 'Protocol for sharing court lists in criminal proceedings with professional court users - GOV.UK',
                href: 'https://www.gov.uk/government/publications/protocol-for-sharing-court-lists-in-criminal-proceedings-with-professional-court-users/protocol-for-sharing-court-lists-in-criminal-proceedings-with-professional-court-users',
            },
        ];

        expectedLinks.forEach(expected => {
            const link = links.find(a => a.textContent.trim() === expected.text);
            expect(link, `Could not find link text: ${expected.text}`).to.exist;
            expect(link.getAttribute('href')).equals(expected.href, `Incorrect href for: ${expected.text}`);
        });
    });
});
