import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/create-third-party-subscriber';

const cookie = {
    thirdPartySubscriberName: 'Test name',
};

app.request['cookies'] = {
    formCookie: JSON.stringify(cookie),
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Create third-party subscriber page', () => {
    describe('without error', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains('Create third-party subscriber', 'Header does not match');
        });

        it('should display name input field', () => {
            const nameLabel = htmlRes.getElementsByClassName('govuk-label')[0];
            const input = htmlRes.getElementById('thirdPartySubscriberName');

            expect(nameLabel.innerHTML).contains('Name', 'Name label does not match');
            expect(input.getAttribute('value')).equals('Test name', 'Name value does not match');
        });

        it('should display continue button', () => {
            const button = htmlRes.getElementsByClassName('govuk-button')[0];
            expect(button.innerHTML).contains('Continue', 'Continue button does not match');
        });
    });

    describe('with error', () => {
        beforeAll(async () => {
            await request(app)
                .post(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display error dialog', () => {
            const dialog = htmlRes.getElementsByClassName('govuk-error-summary');
            expect(dialog[0].getElementsByClassName('govuk-error-summary__title')[0].innerHTML).contains(
                'There is a problem',
                'Could not find error dialog title'
            );
        });

        it('should display error summary messages', () => {
            const errorMessage = htmlRes.getElementsByClassName('govuk-error-message');
            expect(errorMessage[0].innerHTML).contains('Enter name', 'Name error does not match');
        });
    });
});
