import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/edit-list-type-search-config-success';
let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Edit List Type Search Config Success Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display success panel with correct heading', () => {
        const panelTitle = htmlRes.getElementsByClassName('govuk-panel__title');
        expect(panelTitle[0].innerHTML).to.contains('List type search configuration successful');
    });

    it('should display success panel with correct body message', () => {
        const panelBody = htmlRes.getElementsByClassName('govuk-panel__body');
        expect(panelBody[0].innerHTML).to.contains('The list type search configuration has been updated');
    });

    it('should display what do you want to do next paragraph', () => {
        const paragraphs = htmlRes.getElementsByClassName('govuk-body');
        const nextMessageParagraph = Array.from(paragraphs).find(p =>
            p.innerHTML.includes('What do you want to do next?')
        );
        expect(nextMessageParagraph).to.exist;
    });

    it('should display manage list types link with correct href', () => {
        const links = htmlRes.getElementsByClassName('govuk-link ');
        const manageLink = Array.from(links).find(l =>
            l.innerHTML.includes('Manage another list type search configuration')
        );
        expect(manageLink).to.exist;
        expect(manageLink?.getAttribute('href')).to.equal('manage-list-types');
    });
});
