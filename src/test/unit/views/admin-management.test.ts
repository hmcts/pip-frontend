import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/admin-management';
const linkClass = 'govuk-link';
const buttonClass = 'govuk-button';
const expectedButtonText = 'Continue';
const headingClass = 'govuk-label-wrapper';
let htmlRes: Document;

describe('Admin Management Page', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('User Management', 'Page title does not match header');
    });

    it('should display back button', () => {
        const backButton = htmlRes.getElementsByClassName(linkClass);
        expect(backButton[5].innerHTML).contains('Back', 'Back button does not contain correct text');
    });

    it('should display the header', () => {
        const header = htmlRes.getElementsByClassName(headingClass)[0].getElementsByClassName('govuk-label--l');
        expect(header[0].innerHTML).contains('What is the users email address?', 'Could not find the header');
    });

    it('should display continue button', () => {
        const buttons = htmlRes.getElementsByClassName(buttonClass);
        expect(buttons[4].innerHTML).contains(expectedButtonText, 'Could not find button');
    });
});
