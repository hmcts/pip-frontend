import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/location-metadata-delete-confirmed';
expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Location metadata delete confirmed page', () => {
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
        expect(pageTitle).equals('Location metadata deleted', 'Page title does not match');
    });

    it('should have correct header', () => {
        const heading = htmlRes.getElementsByClassName('govuk-panel__title');
        expect(heading[0].innerHTML).equals('Location metadata deleted', 'Header does not match');
    });

    it('should display correct message in body', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).equals('What do you want to do next?', 'Body text does not match');
    });

    it('should contain the location metadata search link', () => {
        const link = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByClassName('govuk-link')[0];
        expect(link.innerHTML).equals(
            'Search for location metadata by court or tribunal name',
            'Link text does not match'
        );
        expect(link.getAttribute('href')).equals('location-metadata-search', 'Link does not match');
    });
});
