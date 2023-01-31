import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';

const PAGE_URL = '/bulk-create-media-accounts-confirmed';
app.request['user'] = { roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Bulk Create Media Accounts Confirmed Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains('Media accounts created', 'Page title does not match');
    });

    it('should display confirmation panel component', () => {
        const panel = htmlRes.getElementsByClassName('govuk-panel--confirmation');
        expect(panel.length).to.equal(1);
    });

    it('should display confirmation within the panel', () => {
        const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title')[0];
        const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body')[0];
        expect(panelTitle.innerHTML).to.contains('Media accounts created', 'Success panel title does not match');
        expect(panelMessage.innerHTML).to.contains(
            'The file has been uploaded successfully and all accounts have been created',
            'Success panel message does not match'
        );
    });

    it('should display correct message in body', () => {
        const body = htmlRes.getElementsByClassName('govuk-body');
        expect(body[0].innerHTML).contains('What do you want to do next?', 'Body text does not match');
    });

    it('should contain the bulk create media accounts link', () => {
        const link = htmlRes.getElementsByClassName('govuk-body')[1].getElementsByClassName('govuk-link')[0];
        expect(link.innerHTML).to.equal('Upload another file', 'Link text does not match');
        expect(link.getAttribute('href')).to.equal('bulk-create-media-accounts', 'Link does not match');
    });

    it('should contain the system admin dashboard link', () => {
        const link = htmlRes.getElementsByClassName('govuk-body')[2].getElementsByClassName('govuk-link')[0];
        expect(link.innerHTML).to.equal('Home', 'Link text does not match');
        expect(link.getAttribute('href')).to.equal('system-admin-dashboard', 'Link does not match');
    });
});
