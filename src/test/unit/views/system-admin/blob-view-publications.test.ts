import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../../../main/app';
import { LocationService } from '../../../../main/service/LocationService';
import { SummaryOfPublicationsService } from '../../../../main/service/SummaryOfPublicationsService';

const publicationsMock = [
    { artefactId: '1', listType: 'TYPE1', locationId: '1', publicationDate: '2024-06-01', contentDate: '2024-06-01' },
    { artefactId: '2', listType: 'TYPE2', locationId: '1', publicationDate: '2024-06-02', contentDate: '2024-06-02' },
];

sinon.stub(SummaryOfPublicationsService.prototype, 'getPublications').resolves(publicationsMock);
sinon.stub(SummaryOfPublicationsService.prototype, 'getNoMatchPublications').resolves([
    {
        artefactId: '3',
        listType: 'TYPE3',
        locationId: '2',
        publicationDate: '2024-06-03',
        contentDate: '2024-06-03',
    },
]);
sinon.stub(LocationService.prototype, 'getLocationById').resolves({ locationId: 1, name: 'Alpha Court' });
sinon.stub(LocationService.prototype, 'findCourtName').returns('Alpha Court');

const headingClass = 'govuk-heading-l';
const tableClass = 'govuk-table';
const linkClass = 'govuk-link--no-underline';

describe('Blob View Publications Page', () => {
    let htmlRes: Document;
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
        await request(app)
            .get('/blob-view-publications?locationId=1')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).contains(
            'System Admin - Blob Explorer Publications - Court and Tribunal Hearings - GOV.UK',
            'Could not find the title'
        );
    });

    it('should display the main heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass)[0];
        expect(header.innerHTML).to.contain('Blob Explorer Publications');
    });

    it('should display the location name as a subheading', () => {
        const subheading = htmlRes.getElementsByClassName('govuk-heading-m')[0];
        expect(subheading.innerHTML).to.contain('Alpha Court');
    });

    it('should display the publications table', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        expect(table).to.exist;
    });

    it('should have links for each publication', () => {
        const links = htmlRes.getElementsByClassName(linkClass);
        expect(links.length).to.be.greaterThan(0);
        expect(links[0].getAttribute('href')).to.contain('blob-view-publication?artefactId=1');
        expect(links[1].getAttribute('href')).to.contain('blob-view-publication?artefactId=2');
    });

    it('should display table headers', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        const headerRow = table.getElementsByTagName('tr')[0];
        const headers = headerRow.getElementsByTagName('th');
        expect(headers.length).to.equal(3);
        expect(headers[0].innerHTML).to.equal('Artefact Id');
        expect(headers[1].innerHTML).to.equal('List Type');
        expect(headers[2].innerHTML).to.equal('Display From / To');
    });
});

describe('Blob View Publications Page - No Match Artefacts', () => {
    let htmlRes: Document;

    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
        await request(app)
            .get('/blob-view-publications?locationId=noMatch')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display the main heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass)[0];
        expect(header.innerHTML).to.contain('Blob Explorer Publications');
    });

    it('should display "No match artefacts" as the location name', () => {
        const subheading = htmlRes.getElementsByClassName('govuk-heading-m')[0];
        expect(subheading.innerHTML).to.contain('No match artefacts');
    });

    it('should display the publications table for no match artefacts', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        expect(table).to.exist;
    });

    it('should have a link for the no match publication', () => {
        const links = htmlRes.getElementsByClassName(linkClass);
        expect(links.length).to.be.greaterThan(0);
        expect(links[0].getAttribute('href')).to.contain('blob-view-publication?artefactId=3');
    });

    it('should display table headers', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        const headerRow = table.getElementsByTagName('tr')[0];
        const headers = headerRow.getElementsByTagName('th');
        expect(headers.length).to.equal(4);
        expect(headers[0].innerHTML).to.equal('Artefact Id');
        expect(headers[1].innerHTML).to.equal('Location Id');
        expect(headers[2].innerHTML).to.equal('List Type');
        expect(headers[3].innerHTML).to.equal('Display From / To');
    });
});
