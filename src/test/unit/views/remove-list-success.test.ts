import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/remove-list-success';
let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Remove List Success Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display confirmation within the panel', () => {
        const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
        const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body');
        expect(panelTitle[0].innerHTML).to.contains('Success');
        expect(panelMessage[0].innerHTML).to.contains('Your file has been removed');
    });

    it('should display what happens next paragraph', () => {
        const message = htmlRes.getElementsByClassName('govuk-body')[4];
        expect(message.innerHTML).to.equal('What do you want to do next?');
    });

    it('should display links to other actions with correct paths', () => {
        const links = htmlRes.getElementsByClassName('govuk-link ');
        expect(links[5].innerHTML).to.equal('Remove another file');
        expect(links[5].getAttribute('href')).contains('remove-list-search');
        expect(links[6].innerHTML).to.equal('Upload a file');
        expect(links[6].getAttribute('href')).contains('manual-upload');
        expect(links[7].innerHTML).to.equal('Home');
        expect(links[7].getAttribute('href')).contains('admin-dashboard');
    });
});
