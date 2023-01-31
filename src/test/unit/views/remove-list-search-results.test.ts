import { LocationService } from '../../../main/service/locationService';
import { SummaryOfPublicationsService } from '../../../main/service/summaryOfPublicationsService';
import { ManualUploadService } from '../../../main/service/manualUploadService';
import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../main/app';
import { expect } from 'chai';
import { request as expressRequest } from 'express';

const PAGE_URL = '/remove-list-search-results?locationId=5';
const mockCourt = {
    locationId: '5',
    name: 'The court',
};
const mockPublications = [
    {
        listItem: 'SJP_PUBLIC_LIST',
        displayFrom: '2022-02-08T12:26:42.908',
        contDate: '2022-02-08T12:26:42.908',
        displayTo: '2024-02-08T12:26:42.908',
        dateRange: '8 Feb 2022 to 8 Feb 2024',
        listTypeName: 'SJP Public List',
        locationId: '5',
        artefactId: 'valid-artefact',
        language: 'ENGLISH',
        sensitivity: 'PUBLIC',
    },
    {
        listItem: 'SJP_PUBLIC_LIST',
        displayFrom: '2022-02-16T12:26:42.908',
        displayTo: '2024-02-08T12:26:42.908',
        contDate: '2022-02-08T12:26:42.908',
        dateRange: '8 Feb 2022 to 8 Feb 2024',
        listTypeName: 'SJP Public List',
        locationId: '5',
        artefactId: 'valid-artefact-777',
        language: 'WELSH',
        sensitivity: 'CLASSIFIED',
    },
    {
        listItem: 'SJP_PUBLIC_LIST',
        displayFrom: '2022-02-16T12:26:42.908',
        displayTo: '2024-02-08T12:26:42.908',
        contDate: '2022-02-08T12:26:42.908',
        dateRange: '8 Feb 2022 to 8 Feb 2024',
        listTypeName: 'SJP Public List',
        locationId: '5',
        artefactId: 'valid-artefact-777',
        language: 'BI_LINGUAL',
        sensitivity: 'CLASSIFIED',
    },
];
const tableHeaders = ['List type', 'Court', 'Content Date', 'Date', 'Language', 'Sensitivity', 'Actions'];
const languageRowValues = ['English', 'Welsh', 'Bilingual'];
const sensitivityValues = ['Public', 'Classified', 'Classified'];
sinon.stub(LocationService.prototype, 'getLocationById').resolves(mockCourt);
sinon
    .stub(SummaryOfPublicationsService.prototype, 'getPublications')
    .withArgs('5', true, true)
    .resolves(mockPublications);
sinon.stub(ManualUploadService.prototype, 'formatListRemovalValues').returns(mockPublications);

expressRequest['user'] = { roles: 'SYSTEM_ADMIN' };

let htmlRes: Document;

describe('Remove List Summary Page', () => {
    beforeAll(async () => {
        await request(app)
            .get(PAGE_URL)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should display header', () => {
        const header = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(header[0].innerHTML).contains('Select content to remove', 'Could not find correct value in header');
    });

    it('should display results count', () => {
        const resultsCount = htmlRes.getElementsByClassName('govuk-body')[0];
        expect(resultsCount.innerHTML).contains('Showing 3 result(s)', 'Could not find results paragraph');
    });

    it('should display correct table headers', () => {
        const headerNames = htmlRes.getElementsByClassName('govuk-table__header');
        for (let i = 0; i < tableHeaders.length; i++) {
            expect(headerNames[i].innerHTML).contains(
                tableHeaders[i],
                `Could not find correct header (${tableHeaders[i]})`
            );
        }
    });

    it('should display correct row values', () => {
        const tableRows = htmlRes
            .getElementsByClassName('govuk-table__body')[0]
            .getElementsByClassName('govuk-table__row');
        expect(tableRows.length).equal(3, 'Incorrect table rows count');
        for (let i = 0; i < tableRows.length; i++) {
            const rowCells = tableRows[i].getElementsByClassName('govuk-table__cell');
            const removeActionHref = htmlRes
                .getElementsByClassName('unsubscribe-action')
                [i].getAttribute('href')
                .valueOf();
            expect(rowCells[0].innerHTML).contains(
                mockPublications[i].listTypeName,
                'Could not find valid list type name'
            );
            expect(rowCells[1].innerHTML).contains(mockCourt.name, 'Could not find valid court name');
            expect(rowCells[2].innerHTML).contains(mockPublications[i].contDate, 'Could not find valid contentDate');
            expect(rowCells[3].innerHTML).contains(
                mockPublications[i].dateRange,
                'Could not find valid list date range'
            );
            expect(rowCells[4].innerHTML).contains(languageRowValues[i], 'Could not find valid language');
            expect(rowCells[5].innerHTML).contains(sensitivityValues[i], 'Could not find valid sensitivity');
            expect(rowCells[6].innerHTML).contains('Remove', 'Could not find valid action');
            expect(removeActionHref).contains(
                `remove-list-confirmation?artefact=${mockPublications[i].artefactId}`,
                'Could not find valid action href'
            );
        }
    });
});
