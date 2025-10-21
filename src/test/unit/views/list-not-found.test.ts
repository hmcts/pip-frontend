import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/list-not-found';
let htmlRes: Document;

describe('List Not Found Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                // Remove any unwanted divs if present (as in other tests)
                if (htmlRes.getElementsByTagName('div').length > 0) {
                    htmlRes.getElementsByTagName('div')[0].remove();
                }
            });
    });

    it('should display the correct header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-xl')[0];
        expect(header.innerHTML).contains('Page Not Found', 'Header does not match');
    });
});
