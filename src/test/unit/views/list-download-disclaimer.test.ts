import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/list-download-disclaimer?artefactId=abc';
let htmlRes: Document;

expressRequest['user'] = { roles: 'VERIFIED' };

describe('List Download Disclaimer Page', () => {
    describe('without error', () => {
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
            expect(pageTitle).contains('Terms and conditions', 'Page title does not match');
        });

        it('should display header', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains('Terms and conditions', 'Header does not match');
        });

        it('should display the body text', () => {
            const bodyText = htmlRes.getElementsByClassName('govuk-body');
            expect(bodyText[0].innerHTML).contains(
                'As a verified user of the court and tribunal hearings service you are authorised to download this file containing personal protected data.',
                'Body text does not match'
            );
            expect(bodyText[1].innerHTML).contains(
                'It is your responsibility to ensure you comply with any GDPR and/or reporting restrictions regarding the content of this file.',
                'Body text does not match'
            );
        });

        it('should display checkbox', () => {
            const checkboxLabel = htmlRes.getElementsByClassName('govuk-checkboxes__label');
            expect(checkboxLabel[0].innerHTML).contains(
                'Please tick this box to agree to the above terms and conditions',
                'Checkbox label does not match'
            );
        });
    });

    describe('with error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .send({})
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error summary', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error dialog title'
            );
        });

        it('should display error messages in the summary', () => {
            const list = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const listItems = list.getElementsByTagName('a');
            expect(listItems[0].innerHTML).contains(
                'You must agree to the terms and conditions',
                'Could not find error'
            );
        });
    });
});
