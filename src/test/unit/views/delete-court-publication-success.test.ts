import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/delete-court-publication-success';

const court = {
    locationId: 1,
    name: 'test court',
    locationType: 'location',
    jurisdiction: 'testJ',
    region: 'testR',
};
sinon.stub(LocationService.prototype, 'getLocationById').resolves(court);

let htmlRes: Document;

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

describe('Delete Court Publication Success Page', () => {
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
        expect(panelMessage[0].innerHTML).to.contains('Court publication(s) has been deleted');
    });

    it('should display what happens next paragraph', () => {
        const message = htmlRes.getElementsByClassName('govuk-body')[4];
        expect(message.innerHTML).to.equal('What do you want to do next?');
    });

    it('should display links to other actions with correct paths', () => {
        const links = htmlRes.getElementsByClassName('govuk-link ');
        expect(links[5].innerHTML).contains('Continue deletion of ');
        expect(links[5].getAttribute('href')).contains('delete-court-reference-data-confirmation');
        expect(links[6].innerHTML).to.equal('Upload Reference Data');
        expect(links[6].getAttribute('href')).contains('manual-reference-data-upload');
        expect(links[7].innerHTML).to.equal('Home');
        expect(links[7].getAttribute('href')).contains('system-admin-dashboard');
    });
});
