import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { MediaApplicationService } from '../../../main/service/mediaApplicationService';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/mediaApplications.json'), 'utf-8');
const mediaApplications = JSON.parse(rawData);
sinon.stub(MediaApplicationService.prototype, 'getPendingMediaApplications').resolves(mediaApplications);

const PAGE_URL = '/media-applications';
let htmlRes: Document;

const headingClass = 'govuk-heading-l';
const tableClass = 'govuk-table';

const expectedHeader = 'Select application to assess';

expressRequest['user'] = { roles: 'INTERNAL_ADMIN_CTSC' };

describe('Media applications page', () => {
    beforeEach(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName(headingClass);
        expect(header[0].innerHTML).contains(expectedHeader, 'Could not find the header');
    });

    it('should display table with 4 columns', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        expect(table.getElementsByTagName('th').length).to.equal(4, 'should display 4 columns');
    });

    it('should hide the header of the last column', () => {
        const lastRow = htmlRes.getElementsByClassName(tableClass)[0].getElementsByTagName('th')[3];
        expect(lastRow.hasAttribute('aria-hidden')).to.be.true;
    });

    it('should link to view pages based on id', () => {
        const viewButton = htmlRes.getElementsByClassName(tableClass)[0].getElementsByTagName('a')[0];
        expect(viewButton.getAttribute('href')).equal(
            '/media-account-review?applicantId=234',
            'href did not match expected'
        );
    });
});
