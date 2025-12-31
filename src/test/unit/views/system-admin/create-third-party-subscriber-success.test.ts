import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/create-third-party-subscriber-success';

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

describe('Create third party subscriber success page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display success panel', () => {
        const header = htmlRes.getElementsByClassName('govuk-panel__title')[0];
        expect(header.innerHTML).contains('Third party subscriber created', 'Panel message does not match');
    });

    it('should display correct summary keys', async () => {
        const keys = htmlRes.getElementsByClassName('govuk-summary-list__key');
        expect(keys[0].innerHTML).to.contain('Name', 'Third party subscriber name key does not match');
    });

    it('should display correct summary values', async () => {
        const values = htmlRes.getElementsByClassName('govuk-summary-list__value');
        expect(values[0].innerHTML).to.contain(
            cookie.thirdPartySubscriberName,
            'Third party subscriber name value does not match'
        );
    });
});
