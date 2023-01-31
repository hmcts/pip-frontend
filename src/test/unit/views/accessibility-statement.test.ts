import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';

const PAGE_URL = '/accessibility-statement';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('accessibility-statement', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display the page header', () => {
        const header = htmlRes.getElementsByClassName(largeHeadingClass);

        expect(header[0].innerHTML).contains(
            'Accessibility statement for the court and tribunal ' + 'hearings service',
            'Could not find the header'
        );
    });

    it('should display the heading in section 2', () => {
        const div = htmlRes.getElementById('section2');

        expect(div.textContent).contains('How accessible this website is', 'Could not find section 2 heading');
    });

    it('should display the heading in section 3', () => {
        const div = htmlRes.getElementById('section3');

        expect(div.textContent).contains('Feedback and contact information', 'Could not find section 3 heading');
    });

    it('should display the heading in section 4', () => {
        const div = htmlRes.getElementById('section4');

        expect(div.textContent).contains(
            'Reporting accessibility problems with this website',
            'Could not find section 4 heading'
        );
    });

    it('should display the heading in section 5', () => {
        const div = htmlRes.getElementById('section5');

        expect(div.textContent).contains('Enforcement procedure', 'Could not find section 5 heading');
    });

    it('should display the heading in section 6', () => {
        const div = htmlRes.getElementById('section6');

        expect(div.textContent).contains(
            'Contacting us by phone or visiting us in person',
            'Could not find section 6 heading'
        );
    });

    it('should display the heading in section 7', () => {
        const div = htmlRes.getElementById('section7');

        expect(div.textContent).contains(
            'Technical information about this website’s accessibility',
            'Could not find section 7 heading'
        );
    });

    it('should display the headings in section 8', () => {
        const div = htmlRes.getElementById('section8');

        expect(div.textContent).contains('Compliance status', 'Could find find section 8 heading');
        expect(div.textContent).contains('Non-accessible content', 'Could not find section 8 small heading');
    });

    it('should display the subHeading in section 8', () => {
        const div = htmlRes.getElementById('section9');
        expect(div.textContent).contains('Non-compliance with the accessibility regulations');
    });

    it('should display the heading in section 10', () => {
        const div = htmlRes.getElementById('section10');

        expect(div.textContent).contains(
            'What we’re doing to improve accessibility',
            'Could not find section 9 heading'
        );
    });

    it('should display the heading in section 11', () => {
        const div = htmlRes.getElementById('section11');

        expect(div.textContent).contains(
            'Preparation of this accessibility statement',
            'Could not find section 11 heading'
        );
    });
});
