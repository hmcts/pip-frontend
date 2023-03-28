import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/summary-of-publications';

describe('Error page', () => {
    let htmlRes: Document;
    const headingClass = 'govuk-heading-xl';
    const bodyClass = 'govuk-body';

    // Use summary of publications url without the locationId query parameter to trigger the error page.
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display error heading', () => {
        const heading = htmlRes.getElementsByClassName(headingClass);
        expect(heading[0].innerHTML).contains('Sorry, there is a problem with the service');
    });

    it('should display error messages', () => {
        const body = htmlRes.getElementsByClassName(bodyClass);
        expect(body[4].innerHTML).contains('Please try again later.');
        expect(body[5].innerHTML).contains(
            'If the problem persists please contact our courts and tribunals service centre on 0300 303 0656.'
        );
    });
});
