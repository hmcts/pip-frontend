import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('Media rejected login page', () => {
    beforeAll(async () => {
        const PAGE_URL = '/media-rejected-login';
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display the page header', () => {
        const header = htmlRes.getElementsByClassName(largeHeadingClass);
        expect(header[0].innerHTML).contains('Sign in failed', 'Could not find the header');
    });

    it('should display the body text', () => {
        const bodyText = htmlRes.getElementsByClassName('govuk-body');
        expect(bodyText[4].innerHTML).contains(
            'You have attempted to sign in as a member of HMCTS staff.',
            'Could not find body text'
        );
        expect(bodyText[5].innerHTML).contains(
            'Please always sign in using the following link below to sign in with your court and tribunal hearings account.',
            'Could not find body text'
        );
    });

    it('should display the link', () => {
        const link = htmlRes.getElementsByClassName('govuk-link');
        expect(link[3].textContent).contains('/sign-in', 'Could not find link');
        expect(link[3].outerHTML).contains('/sign-in', 'Could not find href in link');
    });
});
