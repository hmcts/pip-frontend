import { app } from '../../../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/blob-view-subscription-resubmit-confirmed';
app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Blob explorer subscription re-submit confirmed page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals('Subscription re-submitted', 'Page title does not match');
    });

    it('should have correct header', () => {
        const heading = htmlRes.getElementsByClassName('govuk-panel__title');
        expect(heading[0].innerHTML).contains('Subscription re-submitted', 'Header does not match');
    });

    it('should display correct message in body', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).equals('What do you want to do next?', 'Body text does not match');
    });

    it('should contain the blob view locations link', () => {
        const link = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByClassName('govuk-link')[0];
        expect(link.innerHTML).equals('Blob explorer - Locations', 'Link text does not match');
        expect(link.getAttribute('href')).equals('blob-view-locations', 'Link does not match');
    });
});
