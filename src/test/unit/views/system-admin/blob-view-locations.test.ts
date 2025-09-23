import sinon from 'sinon';
import request from 'supertest';
import { expect } from 'chai';
import { app } from '../../../../main/app';
import { LocationService } from '../../../../main/service/LocationService';
import { PublicationService } from '../../../../main/service/PublicationService';

const locationsMock = [
    { locationId: 1, name: 'Gamma Court' },
    { locationId: 2, name: 'Beta Court' },
    { locationId: 3, name: 'Delta Court' },
    { locationId: 4, name: 'Alpha Court' },
];
const countsMock = new Map([
    ['1', 5],
    ['2', 10],
    ['3', 7],
    ['4', 3],
    ['noMatch', 2],
]);

sinon.stub(LocationService.prototype, 'fetchAllLocations').resolves(locationsMock);
sinon.stub(PublicationService.prototype, 'getCountsOfPubsPerLocation').resolves(countsMock);

const headingClass = 'govuk-heading-l';
const tableClass = 'govuk-table';
const tableRowClass = 'govuk-table__row';
const linkClass = 'govuk-link--no-underline';

let htmlRes: Document;

describe('Blob View Locations Page', () => {
    beforeAll(async () => {
        app.request['user'] = { userId: '1', roles: 'SYSTEM_ADMIN' };
        await request(app)
            .get('/blob-view-locations')
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display the main heading', () => {
        const header = htmlRes.getElementsByClassName(headingClass)[0];
        expect(header.innerHTML).to.contain('Blob Explorer - Locations');
    });

    it('should display the locations table', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        expect(table).to.exist;
    });

    it('should display table headers', () => {
        const table = htmlRes.getElementsByClassName(tableClass)[0];
        const headerRow = table.getElementsByTagName('tr')[0];
        const headers = headerRow.getElementsByTagName('th');
        expect(headers.length).to.equal(2);
        expect(headers[0].innerHTML).to.equal('Location');
        expect(headers[1].innerHTML).to.equal('Number of Publications');
    });

    it('should display all locations sorted by name', () => {
        const rows = htmlRes.getElementsByClassName(tableRowClass);
        // First row is header, so skip it
        const locationNames = [
            rows[1].children[0].innerHTML,
            rows[2].children[0].innerHTML,
            rows[3].children[0].innerHTML,
            rows[4].children[0].innerHTML,
        ];
        expect(locationNames[0]).to.contain('Alpha Court');
        expect(locationNames[1]).to.contain('Beta Court');
        expect(locationNames[2]).to.contain('Delta Court');
        expect(locationNames[3]).to.contain('Gamma Court');
    });

    it('should display correct publication counts for each location', () => {
        const rows = htmlRes.getElementsByClassName(tableRowClass);
        expect(rows[1].children[1].innerHTML).to.equal('3');
        expect(rows[2].children[1].innerHTML).to.equal('10');
        expect(rows[3].children[1].innerHTML).to.equal('7');
        expect(rows[4].children[1].innerHTML).to.equal('5');
    });

    it('should display the No match artefacts row', () => {
        const rows = htmlRes.getElementsByClassName(tableRowClass);
        const lastRow = rows[5];
        expect(lastRow.children[0].innerHTML).to.contain('No match artefacts');
        expect(lastRow.children[1].innerHTML).to.equal('2');
    });

    it('should have links for each location', () => {
        const links = htmlRes.getElementsByClassName(linkClass);
        expect(links.length).to.be.greaterThan(0);
        expect(links[0].getAttribute('href')).to.contain('blob-view-publications?locationId=4');
        expect(links[1].getAttribute('href')).to.contain('blob-view-publications?locationId=2');
        expect(links[2].getAttribute('href')).to.contain('blob-view-publications?locationId=3');
        expect(links[3].getAttribute('href')).to.contain('blob-view-publications?locationId=1');
        expect(links[4].getAttribute('href')).to.contain('blob-view-publications?locationId=noMatch');
    });
});
