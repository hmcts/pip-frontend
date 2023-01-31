import { app } from '../../../main/app';
import request from 'supertest';
import { expect } from 'chai';

const PAGE_URL = '/bulk-create-media-accounts';
app.request['user'] = { roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Bulk Create Media Accounts Page', () => {
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
            expect(pageTitle).contains('Bulk create media accounts', 'Page title does not match');
        });

        it('should have correct header', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains('Bulk create media accounts', 'Header does not match');
        });

        it('should display correct messages in body', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[0].innerHTML).contains(
                'Upload a csv file containing a list of media accounts to be created.',
                'Description text does not match'
            );
            expect(body[1].innerHTML).contains(
                'Each record must include the email, first name and surname information.',
                'Inset text does not match'
            );
            expect(body[2].innerHTML).contains(
                "The file must also have the header 'email,firstName,surname'.",
                'Inset text does not match'
            );
            expect(body[3].innerHTML).contains(
                'Note the upload process has a maximum of 30 accounts created per run. ' +
                    'Please ensure the file uploaded for processing has no more than 30 cases.',
                'Inset text does not match'
            );
        });

        it('should display continue button', () => {
            const button = htmlRes.getElementsByTagName('button')[0];
            expect(button.innerHTML).contains('Continue', 'Could not find continue button');
        });
    });

    describe('with error', () => {
        beforeAll(async () => {
            app.request['file'] = {
                size: 2000001,
                originalname: 'too_large_file.pdf',
            };

            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error title in the summary', () => {
            const error = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(error[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Error title does not match'
            );
        });

        it('should display error messages in the summary', () => {
            const error = htmlRes.getElementsByClassName(' govuk-error-summary__list')[0];
            const errorItem = error.getElementsByTagName('a')[0];
            expect(errorItem.innerHTML).contains(
                'File too large, please upload a file smaller than 2MB',
                'Error message does not match'
            );
        });
    });
});
