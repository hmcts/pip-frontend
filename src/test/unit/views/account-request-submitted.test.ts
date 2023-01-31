import { app } from '../../../main/app';
import { expect } from 'chai';
import request from 'supertest';

const PAGE_URL = '/account-request-submitted';
const pageTitleValue = 'Account request submitted';
let htmlRes: Document;

describe('Account request submitted page', () => {
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
        expect(pageTitle).contains(pageTitleValue, 'Page title does not match header');
    });

    it('should display panel title', () => {
        const header = htmlRes.getElementsByClassName('govuk-panel__title');
        expect(header[0].innerHTML).contains('Details submitted', 'Could not find correct value in panel title');
    });

    it('should display valid heading message', () => {
        const message = htmlRes.getElementsByClassName('govuk-heading-m');
        expect(message[0].innerHTML).contains(
            'What happens next',
            'Could not find correct value in the heading message'
        );
    });

    it('should display valid review message', () => {
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[0].innerHTML).contains(
            'HMCTS will review your details.',
            'Could not find correct value in the review message'
        );
    });

    it('should display valid more information needed message', () => {
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[1].innerHTML).contains(
            "We'll email you if we need more information or to confirm that your account has been created.",
            'Could not find correct value in the more information message'
        );
    });
    it('should display valid service center message', () => {
        const message = htmlRes.getElementsByClassName('govuk-body');
        expect(message[2].innerHTML).contains(
            'If you do not get an email from us within 5 days, call our courts and tribunals service center on 0300 303 0656.',
            'Could not find correct value in the more service message'
        );
    });
});
