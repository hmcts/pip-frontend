import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/manual-upload-confirmation';
let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Manual Upload Confirmation Page', () => {
    describe('on GET for publication', () => {
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
        expect(pageTitle).contains(
            'Manual upload - File Upload Successful - Court and Tribunal Hearings - GOV.UK',
            'Could not find the title'
        );
    });

        it('should display confirmation within the panel', () => {
            const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
            const panelMessage = htmlRes.getElementsByClassName('govuk-panel__body');
            expect(panelTitle[0].innerHTML).to.contains('File Upload Successful');
            expect(panelMessage[0].innerHTML).to.contains('Your file has been uploaded');
        });

        it('should display what happens next message', () => {
            const message = htmlRes.getElementsByClassName('govuk-body')[0];
            expect(message.innerHTML).to.equal('What do you want to do next?');
        });

        it('should display links to other actions with correct paths', () => {
            const links = htmlRes.getElementsByClassName('govuk-link ');
            expect(links[2].innerHTML).to.equal('Upload another file');
            expect(links[2].getAttribute('href')).contains('manual-upload');
            expect(links[3].innerHTML).to.equal('Remove file');
            expect(links[3].getAttribute('href')).contains('remove-list-search');
            expect(links[4].innerHTML).to.equal('Home');
            expect(links[4].getAttribute('href')).contains('admin-dashboard');
        });
    });

    describe('on GET for non-strategic publication', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL + '?non-strategic=true')
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display links to other actions with correct paths', () => {
            const links = htmlRes.getElementsByClassName('govuk-link ');
            expect(links[2].innerHTML).to.equal('Upload another file');
            expect(links[2].getAttribute('href')).contains('manual-upload?non-strategic=true');
        });
    });
});
