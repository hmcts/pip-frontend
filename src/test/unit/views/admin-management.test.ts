import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/admin-management';
const linkClass = 'govuk-link';
const errorSummaryTitleClass = 'govuk-error-summary__title';
const errorSummaryBodyClass = 'govuk-error-summary__body';
const buttonClass = 'govuk-button';
const expectedButtonText = 'Continue';
const headingClass = 'govuk-label-wrapper';
const formErrorClass = 'govuk-form-group--error';
const fieldErrorClass = 'govuk-error-message';

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

    it('should not display minimum input error message', () => {
        const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
        expect(errorSummary.length).equal(0, 'Found unexpected error message');
    });

    it('should not display input errors', () => {
        const formError = htmlRes.getElementsByClassName(formErrorClass);
        expect(formError.length).equal(0, 'Found unexpected input error');
    });
});

describe('Admin Management Page On Error', () => {
    beforeAll(async () => {
        expressRequest['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

        await request(app)
            .get(PAGE_URL + '?error=true')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display minimum input error message', () => {
        const errorSummary = htmlRes.getElementsByClassName(errorSummaryBodyClass);
        expect(errorSummary[0].innerHTML).contains(
            'There is no user matching that email address',
            'Could not find error message'
        );
    });

    it('should display error message', () => {
        const errorTitle = htmlRes.getElementsByClassName(errorSummaryTitleClass);
        expect(errorTitle[0].innerHTML).contains('There is a problem', 'Could not find error title');
    });

    it('should display input errors', () => {
        const formError = htmlRes.getElementsByClassName(formErrorClass);
        expect(formError.length).equal(1, 'Could not find form errors');
    });

    it('should display additional message', () => {
        const additionalMessage = htmlRes.getElementsByClassName(fieldErrorClass);
        expect(additionalMessage[0].innerHTML).contains(
            'What is the users email address?',
            'Could not find additional message'
        );
    });
});
