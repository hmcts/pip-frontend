import { expect } from 'chai';
import { app } from '../../../main/app';
import request from 'supertest';

const PAGE_URL = '/delete-third-party-user-success';

app.request['user'] = {
    roles: 'SYSTEM_ADMIN',
};

let htmlRes: Document;

describe('Delete third party user success page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display success panel', () => {
        const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title')[0];
        const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body')[0];

        expect(panelTitle.innerHTML).contains('Success', 'Panel title does not match');
        expect(panelMessage.innerHTML).contains(
            'The third party user and associated subscriptions have been removed.',
            'Panel message does not match'
        );
    });

    it('should display what happens next message', () => {
        const message = htmlRes.getElementsByClassName('govuk-body')[0];
        expect(message.innerHTML).to.equal('What do you want to do next?');
    });

    it('should display links to other actions with correct paths', () => {
        const links = htmlRes.getElementsByClassName('govuk-link');
        expect(links[2].innerHTML).to.equal('Manage another third party user');
        expect(links[2].getAttribute('href')).contains('manage-third-party-users');
        expect(links[3].innerHTML).to.equal('Home');
        expect(links[3].getAttribute('href')).contains('system-admin-dashboard');
    });
});
