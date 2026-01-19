import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/manage-third-party-subscriber-oath-config-summary';

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

describe('Create third party subscriber oath config summary page', () => {
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
            'Manage third party subscriber oath config summary',
            'Header does not match'
        );
    });

    it('should display correct summary keys', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
        expect(keys[0].innerHTML).to.contain('Destination URL', 'Destination URL key does not match');
        expect(keys[1].innerHTML).to.contain('Token URL', 'Token URL key does not match');
        expect(keys[2].innerHTML).to.contain('Scope Key', 'Scope Key key does not match');
        expect(keys[3].innerHTML).to.contain('Scope Value', 'Scope Value value does not match');
        expect(keys[4].innerHTML).to.contain('Client ID Key', 'Client ID key does not match');
        expect(keys[5].innerHTML).to.contain('Client ID', 'Client ID does not match');
        expect(keys[6].innerHTML).to.contain('Client Secret Key', 'Client Secret key does not match');
    });

    it('should display correct summary values', async () => {
        const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        expect(values[0].innerHTML).to.contain(cookie.destinationUrl, 'Third party name value does not match');
        expect(values[1].innerHTML).to.contain(cookie.tokenUrl, 'Third party role value does not match');
    });

    it('should display correct summary', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');

        expect(keys[0].innerHTML).to.contain('Destination URL', 'Destination URL key does not match');
        expect(keys[1].innerHTML).to.contain('Token URL', 'Token URL key does not match');
        expect(keys[2].innerHTML).to.contain('Scope Key', 'Scope Key does not match');
        expect(keys[3].innerHTML).to.contain('Scope Value', 'Scope Value does not match');
        expect(keys[4].innerHTML).to.contain('Client ID Key', 'Client ID key does not match');
        expect(keys[5].innerHTML).to.contain('Client ID', 'Client ID does not match');
        expect(keys[6].innerHTML).to.contain('Client Secret Key', 'Client Secret key does not match');
    });

    it('should display correct summary actions', async () => {
        const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');

        let action = actions[0].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Destination URL', 'Destination URL action does not match');
        expect(action.innerHTML).to.contain('Change', 'Destination URL action does not match');
        expect(action.getAttribute('href')).to.equal(
            'manage-third-party-subscriber-oath-config?userId=test-user-123#destinationUrl',
            'Destination url action link does not match'
        );

        action = actions[1].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Token URL', 'Token URL action does not match');
        expect(action.innerHTML).to.contain('Change', 'Destination URL action does not match');
        expect(action.getAttribute('href')).to.equal(
            'manage-third-party-subscriber-oath-config?userId=test-user-123#tokenUrl',
            'Token url action link does not match'
        );

        action = actions[2].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Scope Value', 'Scope Value action does not match');
        expect(action.innerHTML).to.contain('Change', 'Scope Value action does not match');
        expect(action.getAttribute('href')).to.equal(
            'manage-third-party-subscriber-oath-config?userId=test-user-123#scopeValue',
            'Scope Value action link does not match'
        );

        action = actions[3].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Client ID', 'Client ID action does not match');
        expect(action.innerHTML).to.contain('Change', 'Scope Value action does not match');
        expect(action.getAttribute('href')).to.equal(
            'manage-third-party-subscriber-oath-config?userId=test-user-123#clientId',
            'Client ID action link does not match'
        );
    });

    it('should display a confirm button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button')[0];
        expect(button.innerHTML).to.contain('Confirm', 'Confirm button does not match');
    });
});
