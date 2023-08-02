import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import request from 'supertest';
import sinon from 'sinon';
import { app } from '../../../main/app';
import { LocationService } from '../../../main/service/locationService';
import { PublicationRequests } from '../../../main/resources/requests/publicationRequests';

const PAGE_URL = '/summary-of-publications?locationId=0';
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/summaryOfPublications.json'), 'utf-8');
const pubs = JSON.parse(rawData);
let htmlRes: Document;

sinon.stub(PublicationRequests.prototype, 'getPublicationsByCourt').resolves(pubs);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Court Name' });

describe('Publication Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('What do you want to view from', 'Could not find correct value in header');
    });

    it('should sort publications by content date followed by list type', () => {
        const items = htmlRes.getElementsByClassName('das-search-results__link');
        const innerHTMLs = [];
        for (let i = 0; i < items.length; i++) {
            innerHTMLs.push(items[i].innerHTML.replace('\n', '').trim());
        }

        expect(innerHTMLs)
            .to.have.lengthOf(6)
            .to.have.ordered.members([
                'Civil and Family Daily Cause List 14 July 2022 - English (Saesneg)',
                'Civil Daily Cause List 14 July 2022 - English (Saesneg)',
                'Family Daily Cause List 14 July 2022 - English (Saesneg)',
                'Single Justice Procedure Public List 02 February 2022 - English (Saesneg)',
                'Single Justice Procedure Press List (Full List) 02 February 2022 - English (Saesneg)',
                'Single Justice Procedure Public List 28 January 2022 - English (Saesneg)',
            ]);
    });

    it('should display a back button with the correct value', () => {
        const backLink = htmlRes.getElementsByClassName('govuk-back-link');
        expect(backLink[0].innerHTML).contains('Back', 'Back button does not contain correct text');
        expect(backLink[0].getAttribute('href')).equal('#', 'Back value does not contain correct link');
    });
});
