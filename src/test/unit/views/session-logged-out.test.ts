import { expect } from 'chai';

const PAGE_URL = '/session-logged-out';
import request from 'supertest';
import { app } from '../../../main/app';

const expectedHeader = 'You have been signed out';
let htmlRes: Document;

describe('Session Logged out Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(response => {
                htmlRes = new DOMParser().parseFromString(response.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(expectedHeader, 'Page title does not match');
    });

    it('should display panel title', () => {
        const header = htmlRes.getElementsByClassName('govuk-panel__title');
        expect(header[0].innerHTML).contains(expectedHeader, 'Page header does not match');
    });
});
