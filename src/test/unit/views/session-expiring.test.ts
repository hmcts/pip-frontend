import { expect } from 'chai';

const PAGE_URL = '/session-expiring';
import request from 'supertest';
import { app } from '../../../main/app';
import { request as expressRequest } from 'express';

const expectedHeader = 'You will soon be signed out, due to inactivity';
const expectedBody = 'To remain signed in, please click below';
const expectedButtonText = 'Continue';

let htmlRes: Document;

expressRequest['user'] = { roles: 'VERIFIED' };

describe('Session Expiring Page', () => {
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
        expect(pageTitle).contains(expectedHeader, 'Page title does not match header');
    });

    it('should display page header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display page body', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).contains(expectedBody, 'Page body message does not match');
    });

    it('should display sign in button', () => {
        const buttons = htmlRes.getElementsByClassName('govuk-button');
        expect(buttons[0].innerHTML).contains(expectedButtonText, 'Could not find button');
    });
});
