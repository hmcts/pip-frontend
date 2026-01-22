import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { describe } from '@jest/globals';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';

const urlDailyList = '/magistrates-public-adult-court-list-daily';
const urlFutureList = '/magistrates-public-adult-court-list-future';
const artefactIdDailyList = 'abc';
const artefactIdFutureList = 'def';
const artefactIdNoSessions = '123';
const artefactIdNoSession = '456';

const artefactIdMap = new Map<string, string>([
    [urlDailyList, artefactIdDailyList],
    [urlFutureList, artefactIdFutureList],
]);

const bodyText = 'govuk-body';
const tableHeaderClass = 'govuk-table__header';
const tableCellClass = 'govuk-table__cell';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesPublicAdultCourtList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const listDataMissingSessionsObject = JSON.parse(rawData);
delete listDataMissingSessionsObject.document.data.job.sessions;

const listDataMissingSessionArray = JSON.parse(rawData);
delete listDataMissingSessionArray.document.data.job.sessions.session;

const metadataDailyList = JSON.parse(rawMetadata)[0];
metadataDailyList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';
const metadataFutureList = JSON.parse(rawMetadata)[0];
metadataFutureList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_FUTURE';

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

const magsAdultCourtListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsAdultCourtListMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

magsAdultCourtListJsonStub.withArgs(artefactIdDailyList).resolves(listData);
magsAdultCourtListJsonStub.withArgs(artefactIdFutureList).resolves(listData);
magsAdultCourtListJsonStub.withArgs(artefactIdNoSessions).resolves(listDataMissingSessionsObject);
magsAdultCourtListJsonStub.withArgs(artefactIdNoSession).resolves(listDataMissingSessionArray);

magsAdultCourtListMetadataStub.withArgs(artefactIdDailyList).resolves(metadataDailyList);
magsAdultCourtListMetadataStub.withArgs(artefactIdFutureList).resolves(metadataFutureList);
magsAdultCourtListMetadataStub.withArgs(artefactIdNoSessions).resolves(metadataDailyList);
magsAdultCourtListMetadataStub.withArgs(artefactIdNoSession).resolves(metadataDailyList);

let htmlRes: Document;

describe.each([urlDailyList, urlFutureList])("Magistrates Public Adult Court List page with path '%s'", url => {
    const pageUrl = url + '?artefactId=' + artefactIdMap.get(url);

    beforeAll(async () => {
        await request(app)
            .get(pageUrl)
            .then(res => {
                htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                htmlRes.getElementsByTagName('div')[0].remove();
            });
    });

    it('should have correct page title', () => {
        const pageTitle = htmlRes.title;
        expect(pageTitle).equals('Magistrates Public List', 'Page title does not match');
    });

    it('should display page heading', () => {
        const heading = htmlRes.getElementsByClassName('govuk-heading-l');
        expect(heading[0].innerHTML).contains(
            "Magistrates Public List for Abergavenny Magistrates' Court",
            'Could not find the header'
        );
    });

    it('should display fact link text', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[0].innerHTML).contains('Find contact details and other information about courts and tribunals');
    });

    it('should display fact link', () => {
        const text = htmlRes.getElementsByClassName('govuk-link');
        expect(text[2].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
    });

    it('should display list date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[1].innerHTML).equals('List for 14 February 2022');
    });

    it('should display publication date', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[2].innerHTML).contains('Last updated 31 July 2025', 'Publication date does not match');
    });

    it('should display reporting restriction heading', () => {
        const restriction = htmlRes.getElementsByClassName('govuk-grid restriction-list-section');
        expect(restriction[0].innerHTML).contains(
            'Restrictions on publishing or writing about these cases',
            'Reporting restriction heading does not match'
        );
    });

    it('should display the search input box', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
        expect(searchInput[0].innerHTML).contains('Search Cases', 'Search input box not found');
    });

    it('should display Court Name section heading', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-accordion__section-heading');
        const expectedHeadings = [
            "North Shields Magistrates' Court",
            "North Shields Magistrates' Court",
            "North Shields Magistrates' Court - Missing Blocks",
            "North Shields Magistrates' Court - Missing Block",
            "North Shields Magistrates' Court - Missing Cases",
            "North Shields Magistrates' Court - Missing Case",
        ];

        expectedHeadings.forEach((heading, idx) => {
            expect(searchInput[idx].innerHTML).contains(heading, 'Court Name section heading not found');
        });
    });

    it('should display Court Room', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[8].innerHTML).contains('Sitting at 1', 'Court Room does not match');
    });

    it('should display LJA', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[9].innerHTML).contains("LJA: North Northumbria Magistrates' Court", 'LJA does not match');
    });

    it('should display Session Start Time', () => {
        const text = htmlRes.getElementsByClassName(bodyText);
        expect(text[10].innerHTML).contains('Session start 9am', 'Session Start Time does not match');
    });

    it('should display Listing time table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[0].innerHTML).contains('Listing Time', 'Listing time header does not match');
    });

    it('should display Defendant Name table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[1].innerHTML).contains('Defendant Name', 'Defendant name header does not match');
    });

    it('should display Case Number table header', () => {
        const cell = htmlRes.getElementsByClassName(tableHeaderClass);
        expect(cell[2].innerHTML).contains('Case Number', 'Case number header does not match');
    });

    it('should display Block Start table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[0].innerHTML).contains('9am', 'Block Start time does not match');
    });

    it('should display Defendant Name table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[1].innerHTML).contains('Mr Test User', 'Defendant name does not match');
    });

    it('should display Case Number table cell', () => {
        const cell = htmlRes.getElementsByClassName(tableCellClass);
        expect(cell[2].innerHTML).contains('1000000000', 'Case number does not match');
    });

    it('check no cases are shown when blocks or cases are not present', () => {
        const searchInput = htmlRes.getElementsByClassName('govuk-accordion__section');

        [2, 3, 4, 5].forEach(index => {
            expect(searchInput[index].innerHTML).not.contains(tableCellClass, 'Court Name section heading not found');
        });
    });
});

describe.each([artefactIdNoSessions, artefactIdNoSession])(
    'Magistrates Public Adult Court List page renders correctly when no sessions or session',
    artefactId => {
        const pageUrl = urlDailyList + '?artefactId=' + artefactId;

        beforeAll(async () => {
            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display page heading', () => {
            const heading = htmlRes.getElementsByClassName('govuk-heading-l');
            expect(heading[0].innerHTML).contains(
                "Magistrates Public List for Abergavenny Magistrates' Court",
                'Could not find the header'
            );
        });

        it('should display Court Name section heading', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-accordion__section-heading');
            expect(searchInput.length).equals(0, 'Court section heading found when it should not be present');
        });
    }
);
