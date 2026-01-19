// Mock must be at the very top, before any imports
const mockKeyVaultService = {
    createKeyVaultSecretName: jest.fn(),
    getSecret: jest.fn(),
};

jest.mock('../../../../main/service/KeyVaultService', () => ({
    KeyVaultService: jest.fn(() => mockKeyVaultService),
}));

import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';
import sinon from 'sinon';
import { ThirdPartyService } from '../../../../main/service/ThirdPartyService';
import { ThirdPartyRequests } from '../../../../main/resources/requests/ThirdPartyRequests';

const PAGE_URL = '/manage-third-party-subscriber-oath-config';

const userId = 'test-user-123';

const cookie = {
    user: userId,
    createConfig: 'true',
    scopeKey: 'TestSubscriber-test-user-123-scope',
    clientIdKey: 'TestSubscriber-test-user-123-client-id',
    clientSecretKey: 'TestSubscriber-test-user-123-client-secret',
    scopeValue: 'read:data write:data',
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

describe('Manage third party subscriber oath config page', () => {
    sinon.stub(ThirdPartyRequests.prototype, 'getThirdPartySubscriberOathConfigByUserId').resolves(cookie);
    sinon.stub(ThirdPartyService.prototype, 'getThirdPartySubscriberById').resolves({ name: cookie.user });

    // Configure the mock's behavior
    mockKeyVaultService.getSecret.mockImplementation(key => {
        if (key === cookie.scopeKey) {
            return Promise.resolve('read:data write:data');
        }
        if (key === cookie.clientIdKey) {
            return Promise.resolve('client-123');
        }
        return Promise.reject(new Error('Unknown key'));
    });

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
            'Manage third party subscriber Oath Configuration',
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

    it('should display input fields Scope Key', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[2];
        const input = htmlRes.getElementById('scopeKey');

        expect(nameLabel.innerHTML).contains('Scope Key', 'Label does not match');
        expect(input.getAttribute('value')).equals('TestSubscriber-test-user-123-scope', 'Value does not match');
    });

    it('should display input fields Scope Value', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[3];
        const input = htmlRes.getElementById('scopeValue');

        expect(nameLabel.innerHTML).contains('Scope Value', 'Label does not match');
        expect(input.getAttribute('value')).equals('read:data write:data', 'Value does not match');
    });

    it('should display input fields Client ID', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[4];
        const input = htmlRes.getElementById('clientId');

        expect(nameLabel.innerHTML).contains('Client ID Key', 'Label does not match');
        expect(input.getAttribute('value')).equals('client-123', 'Value does not match');
    });

    it('should display input fields Client Secret', () => {
        const nameLabel = htmlRes.getElementsByClassName('govuk-label')[7];
        expect(nameLabel.innerHTML).contains('Client Secret', 'Label does not match');
    });

    it('should display continue button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button')[1];
        expect(button.innerHTML).contains('Create', 'Continue button does not match');
    });
});
