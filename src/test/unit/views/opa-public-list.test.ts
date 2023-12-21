import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';

const PAGE_URL = '/opa-public-list?artefactId=abc';
const WELSH_PAGE_URL = '/opa-public-list?artefactId=def&lng=cy';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/opaPublicList.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const englishMetadata = JSON.parse(rawMetadata)[0];
const welshMetadata = JSON.parse(rawMetadata)[3];

sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: 'Court name',
    welshName: 'Welsh court name',
});
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc').returns(englishMetadata);
metadataStub.withArgs('def').returns(welshMetadata);

describe('OPA Public List page', () => {
    describe('in English', () => {
        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display list header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(
                'Online Plea and Allocation Cases for Court name',
                'Header does not match'
            );
        });

        it('should display venue address town', () => {
            const address = htmlRes.getElementsByClassName('venue-address');
            expect(address[0].innerHTML).contains('town name', 'Venue address town does not match');
        });

        it('should display publishing restriction heading', () => {
            const restriction = htmlRes.getElementsByClassName('restriction-list-section');
            expect(restriction[0].innerHTML).contains(
                'Restrictions on publishing or writing about these cases',
                'Publishing restriction heading does not match'
            );
        });

        it('should display the search input box', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
            expect(searchInput[0].innerHTML).contains('Search Cases', 'Search box does not match');
        });

        it('should display table headers correctly', () => {
            const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Name');
            expect(tableHeaders[1].innerHTML).contains('URN');
            expect(tableHeaders[2].innerHTML).contains('Offence');
            expect(tableHeaders[3].innerHTML).contains('Prosecutor');
            expect(tableHeaders[4].innerHTML).contains('Scheduled First Hearing');
            expect(tableHeaders[5].innerHTML).contains('Reporting Restriction');
        });

        it('should have offender name', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[0].innerHTML).contains('IndividualSurname', 'Could not find the offender name');
        });

        it('should have URN', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[1].innerHTML).contains('URN1234', 'Could not find the URN');
        });

        it('should have the offences', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[2].innerHTML).contains('Offence title', 'Could not find the offence title');
            expect(tableData[2].innerHTML).contains('Offence section', 'Could not find the offence section');
            expect(tableData[2].innerHTML).contains(
                'Offence Reporting Restriction detail',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[20].innerHTML).contains('Offence title 2', 'Could not find the offence title');
            expect(tableData[20].innerHTML).contains('Offence section 2', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains('Organisation Offence Title', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains(
                'Offence Reporting Restriction detail',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[38].innerHTML).contains('Organisation Offence Title 2', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section 2', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains('Organisation Offence Title 3', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section 3', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains(
                'Offence Reporting Restriction detail 3',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[56].innerHTML).contains('', 'The offence title should be empty');
            expect(tableData[56].innerHTML).contains('', 'The offence section should be empty');
            expect(tableData[56].innerHTML).contains(
                '',
                'The offence reporting restriction should be empty'
            );
        });

        it('should have the correct prosecutor', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[3].innerHTML).contains(
                'Prosecution Authority ref 1',
                "Could not find the offender's prosecutor"
            );
        });

        it('should have scheduled first hearing date', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[4].innerHTML).contains('14/09/16', 'Could not find the scheduled first hearing date');
        });

        it('should have case reporting restriction', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[5].innerHTML).contains(
                'Case Reporting Restriction detail line 1',
                'Could not find the case reporting restriction'
            );
        });
    });

    describe('in Welsh', () => {
        beforeAll(async () => {
            await request(app)
                .get(WELSH_PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display list header', () => {
            const header = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(header[0].innerHTML).contains(
                'Achosion Pledio Ar-lein a Dyrannu ar gyfer Welsh court name',
                'Header does not match'
            );
        });

        it('should display venue address town', () => {
            const address = htmlRes.getElementsByClassName('venue-address');
            expect(address[0].innerHTML).contains('town name', 'Venue address town does not match');
        });

        it('should display publishing restriction heading', () => {
            const restriction = htmlRes.getElementsByClassName('restriction-list-section');
            expect(restriction[0].innerHTML).contains(
                'Cyfyngiadau ar gyhoeddi neu ysgrifennu am yr achosion hyn',
                'Publishing restriction heading does not match'
            );
        });

        it('should display the search input box', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
            expect(searchInput[0].innerHTML).contains('Chwilio achosion', 'Search box does not match');
        });

        it('should display table headers correctly', () => {
            const tableHeaders = htmlRes.getElementsByClassName('govuk-table__header');
            expect(tableHeaders[0].innerHTML).contains('Enw');
            expect(tableHeaders[1].innerHTML).contains('URN');
            expect(tableHeaders[2].innerHTML).contains('Trosedd');
            expect(tableHeaders[3].innerHTML).contains('Erlynydd');
            expect(tableHeaders[4].innerHTML).contains('Gwrandawiad Cyntaf Wedi’i Drefnu');
            expect(tableHeaders[5].innerHTML).contains('Cyfyngiad adrodd');
        });

        it('should have offender name', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[0].innerHTML).contains('IndividualSurname', 'Could not find the offender name');
        });

        it('should have URN', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[1].innerHTML).contains('URN1234', 'Could not find the URN');
        });

        it('should have the offences', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[2].innerHTML).contains('Offence title', 'Could not find the offence title');
            expect(tableData[2].innerHTML).contains('Offence section', 'Could not find the offence section');
            expect(tableData[2].innerHTML).contains(
                'Offence Reporting Restriction detail',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[20].innerHTML).contains('Offence title 2', 'Could not find the offence title');
            expect(tableData[20].innerHTML).contains('Offence section 2', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains('Organisation Offence Title', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains(
                'Offence Reporting Restriction detail',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[38].innerHTML).contains('Organisation Offence Title 2', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section 2', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains('Organisation Offence Title 3', 'Could not find the offence title');
            expect(tableData[38].innerHTML).contains('Organisation Offence Section 3', 'Could not find the offence section');
            expect(tableData[38].innerHTML).contains(
                'Offence Reporting Restriction detail 3',
                'Could not find the offence reporting restriction'
            );
            expect(tableData[56].innerHTML).contains('', 'The offence title should be empty');
            expect(tableData[56].innerHTML).contains('', 'The offence section should be empty');
            expect(tableData[56].innerHTML).contains(
                '',
                'The offence reporting restriction should be empty'
            );
        });

        it('should have the correct prosecutor', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[3].innerHTML).contains(
                'Prosecution Authority ref 1',
                "Could not find the offender's prosecutor"
            );
        });

        it('should have scheduled first hearing date', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[4].innerHTML).contains('14/09/16', 'Could not find the scheduled first hearing date');
        });

        it('should have case reporting restriction', () => {
            const tableData = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(tableData[5].innerHTML).contains(
                'Case Reporting Restriction detail line 1',
                'Could not find the case reporting restriction'
            );
        });
    });
});
