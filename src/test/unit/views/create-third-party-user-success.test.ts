import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

const PAGE_URL = '/create-third-party-user-success';

const cookie = {
    thirdPartyName: 'Test',
    thirdPartyRoleObject: { name: 'General third party' },
};

app.request['cookies'] = {
    formCookie: JSON.stringify(cookie),
};

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Create third party user success page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display success panel', () => {
        const panelMessage = htmlRes.getElementsByClassName('govuk-panel__title')[0];
        expect(panelMessage.innerHTML).contains('Third party user has been created', 'Panel message does not match');
    });

    it('should display correct summary keys', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
        expect(keys[0].innerHTML).to.contain('Name', 'Third party name key does not match');
        expect(keys[1].innerHTML).to.contain('User role', 'Third party role key does not match');
    });

    it('should display correct summary values', async () => {
        const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        expect(values[0].innerHTML).to.contain(cookie.thirdPartyName, 'Third party name value does not match');
        expect(values[1].innerHTML).to.contain(
            cookie.thirdPartyRoleObject.name,
            'Third party role value does not match'
        );
    });
});
