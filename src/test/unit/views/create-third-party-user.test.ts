import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

const PAGE_URL = '/create-third-party-user';

const cookie = {
    thirdPartyName: 'Test name',
    thirdPartyRole: 'GENERAL_THIRD_PARTY',
};

const radioLabels = [
    'General third party',
    'Verified third party - CFT',
    'Verified third party - Crime',
    'Verified third party - Press',
    'Verified third party - CFT and Crime',
    'Verified third party - CFT and Press',
    'Verified third party - Crime and Press',
    'Verified third party - All',
];

app.request['cookies'] = {
    formCookie: JSON.stringify(cookie),
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Create third party user page', () => {
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
            expect(header[0].innerHTML).contains('Create third party user', 'Header does not match');
        });

        it('should display name input field', () => {
            const nameLabel = htmlRes.getElementsByClassName('govuk-label')[0];
            const input = htmlRes.getElementById('thirdPartyName');

            expect(nameLabel.innerHTML).contains('Name', 'Name label does not match');
            expect(input.getAttribute('value')).equals('Test name', 'Name value does not match');
        });

        it('should display user role radio items', () => {
            const radioHeader = htmlRes.getElementsByClassName('govuk-fieldset__legend')[0];
            const radioItems = htmlRes.getElementsByClassName('govuk-radios__item');

            expect(radioHeader.innerHTML).contains('User role', 'ROle label does not match');

            const radiosCount = radioItems.length;
            expect(radiosCount).equal(8, '8 radio buttons not found');
            for (let i = 0; i < radiosCount; i++) {
                const radio = htmlRes.getElementsByClassName('govuk-radios__label')[i];
                expect(radio.innerHTML).contains(radioLabels[i], 'Could not find radio with correct label');
            }
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
            expect(errorMessage[1].innerHTML).contains('Select a role', 'Role error does not match');
        });
    });
});
