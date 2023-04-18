import { expect } from 'chai';
import request from 'supertest';

import { app } from '../../../main/app';
const largeHeadingClass = 'govuk-heading-l';

let htmlRes: Document;

describe('Admin rejected login page', () => {
    beforeAll(async () => {
        const PAGE_URL = '/admin-rejected-login';
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
            'You have attempted to sign in as a member of the media.',
            'Could not find body text'
        );
        expect(bodyText[5].innerHTML).contains(
            'Please always sign in using the following link below to sign in as a court and tribunal hearings service Super Admin or Admin user',
            'Could not find body text'
        );
    });

    it('should display the link', () => {
        const link = htmlRes.getElementsByClassName('govuk-link');
        expect(link[3].textContent).contains('/admin-dashboard', 'Could not find link');
        expect(link[3].outerHTML).contains('/admin-dashboard', 'Could not find href in link');
    });
});
