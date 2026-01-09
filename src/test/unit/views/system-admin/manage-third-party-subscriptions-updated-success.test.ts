import { expect } from 'chai';
import { app } from '../../../../main/app';
import request from 'supertest';

const PAGE_URL = '/manage-third-party-subscriptions-updated-success';

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Manage third-party subscriptions updated success page', () => {
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
        expect(header.innerHTML).contains('Third-party subscriptions updated');
    });

    it('should display what happens next message', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).to.equal('What do you want to do next?');
    });

    it('should display links to other actions with correct paths', () => {
        const body = htmlRes.getElementsByClassName('govuk-link');
        expect(body[2].innerHTML).contains('Manage third-party subscribers');
        expect(body[2].getAttribute('href')).contains('/manage-third-party-subscribers');
        expect(body[3].innerHTML).to.equal('Home');
        expect(body[3].getAttribute('href')).contains('/system-admin-dashboard');
    });
});
