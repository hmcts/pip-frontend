import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/create-third-party-subscriber-summary';

const cookie = {
    thirdPartySubscriberName: 'Test',
};

app.request['cookies'] = {
    formCookie: JSON.stringify(cookie),
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Create third-party subscriber summary page', () => {
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
        expect(header[0].innerHTML).contains('Create third-party subscriber summary', 'Header does not match');
    });

    it('should display correct summary keys', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
        expect(keys[0].innerHTML).to.contain('Name', 'Third party name key does not match');
    });

    it('should display correct summary values', async () => {
        const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        expect(values[0].innerHTML).to.contain(
            cookie.thirdPartySubscriberName,
            'Third party name value does not match'
        );
    });

    it('should display correct summary actions', async () => {
        const actions = htmlRes.getElementsByClassName('govuk-summary-list__actions');

        let action = actions[0].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Change', 'Third party name action does not match');
        expect(action.getAttribute('href')).to.equal(
            'create-third-party-subscriber#thirdPartySubscriberName',
            'Third party name action link does not match'
        );

        action = actions[0].getElementsByClassName('govuk-link')[0];
        expect(action.innerHTML).to.contain('Change', 'Third party role action does not match');
    });

    it('should display a confirm button', () => {
        const button = htmlRes.getElementsByClassName('govuk-button')[0];
        expect(button.innerHTML).to.contain('Confirm', 'Confirm button does not match');
    });
});
