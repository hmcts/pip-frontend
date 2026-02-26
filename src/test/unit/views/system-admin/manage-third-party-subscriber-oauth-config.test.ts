// Mock must be at the very top, before any imports

import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const userId = 'test-user-123';
const PAGE_URL = `/manage-third-party-subscriber-oauth-config?userId=${userId}`;

const cookie = {
    user: userId,
    createConfig: 'true',
    scope: 'read:data write:data',
    clientId: 'client-123',
    clientSecret: 'secret-456',
    destinationUrl: 'https://auth.example.com',
    tokenUrl: 'https://token.example.com',
};

app.request['cookies'] = {
    thirdPartySubscriberCookie: JSON.stringify(cookie),
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Manage third-party subscriber oauth config page', () => {
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
        expect(header[0].innerHTML).contains(
            'Manage third-party subscriber Oauth Configuration',
            'Header does not match'
        );
    });

    it('should display input fields Destination URL', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[0];
        const input = htmlRes.getElementById('destinationUrl');

        expect(nameLabel.innerHTML).contains('Destination URL', 'Label does not match');
        expect(input.getAttribute('value')).equals('https://auth.example.com', 'Value does not match');
    });

    it('should display input fields Token URL', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[1];
        const input = htmlRes.getElementById('tokenUrl');

        expect(nameLabel.innerHTML).contains('Token URL', 'Label does not match');
        expect(input.getAttribute('value')).equals('https://token.example.com', 'Value does not match');
    });

    it('should display input fields Scope Value', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[2];
        const input = htmlRes.getElementById('scope');

        expect(nameLabel.innerHTML).contains('Scope', 'Label does not match');
        expect(input.getAttribute('value')).equals('read:data write:data', 'Value does not match');
    });

    it('should display input fields Client ID', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[3];
        const input = htmlRes.getElementById('clientId');

        expect(nameLabel.innerHTML).contains('Client ID', 'Label does not match');
        expect(input.getAttribute('value')).equals('client-123', 'Value does not match');
    });

    it('should display input fields Client Secret', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[4];
        const input = htmlRes.getElementById('clientSecret');

        expect(nameLabel.innerHTML).contains('Client Secret', 'Label does not match');
        expect(input.getAttribute('value')).equals('secret-456', 'Value does not match');
    });

    it('should display continue button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button')[1];
        expect(button.innerHTML).contains('Create', 'Continue button does not match');
    });
});
