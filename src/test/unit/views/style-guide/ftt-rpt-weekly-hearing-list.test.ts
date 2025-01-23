import sinon from 'sinon';
import request from 'supertest';
import { app } from '../../../../main/app';
import { expect } from 'chai';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';

const headingClass = 'govuk-heading-l';
const bodyText = 'govuk-body';
const govukLinkClass = 'govuk-link';
const cell = 'govuk-table__cell';
const tableHeader = 'govuk-table__header';

describe('Residential Property Weekly Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(
        path.resolve(__dirname, '../../mocks/fttResidentialPropertyTribunalWeeklyHearingList.json'),
        'utf-8'
    );
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('Residential Property Eastern Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/rpt-eastern-weekly-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'RPT_EASTERN_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('abc').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Residential Property Tribunal: Eastern region Weekly Hearing List',
                'Could not find the header'
            );
        });

        it('should display list for text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[4].innerHTML).contains('List for 14 February 2022');
        });

        it('should display contact information text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains(
                'Members of the public wishing to observe a hearing or representatives of the media may, ' +
                    'on their request, join any telephone or video hearing remotely while they are taking place ' +
                    'by sending an email in advance to the tribunal at [insert office email] with the following ' +
                    'details in the subject line “[OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]” and ' +
                    'appropriate arrangements will be made to allow access where reasonably practicable.'
            );
        });

        it('should display observation text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains(
                'Observe a court or tribunal hearing as a journalist, ' + 'researcher or member of the public'
            );
        });

        it('should display observation link', () => {
            const text = htmlRes.getElementsByClassName(govukLinkClass);
            expect(text[5].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
        });

        it('should display Date header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).contains('Date');
        });

        it('should Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Time');
        });

        it('should Venue header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Venue');
        });

        it('should display Case Type header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Case type');
        });

        it('should display Case Reference Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Case reference number');
        });

        it('should display Judge(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Judge(s)');
        });

        it('should display Member(s) header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[6].innerHTML).contains('Member(s)');
        });

        it('should display Hearing Method header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[7].innerHTML).contains('Hearing method');
        });

        it('should display Additional Information header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[8].innerHTML).contains('Additional information');
        });

        it('should display Date cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('16 December 2024');
        });

        it('should display Hearing Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('10am');
        });

        it('should display Venue cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('This is a venue name');
        });

        it('should display Case Type cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('Case Type 1');
        });

        it('should display Case Reference Number data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('1234');
        });

        it('should display Judge(s) cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('Judge A');
        });

        it('should display Member(s) cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[6].innerHTML).contains('Member A');
        });

        it('should display Hearing Method cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[7].innerHTML).contains('Hearing Method A');
        });

        it('should display Additional Information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[8].innerHTML).contains('This is additional information');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains('Data Source: prov1');
        });
    });

    describe('Residential Property London Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/rpt-london-weekly-hearing-list?artefactId=mno';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'RPT_LONDON_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('mno').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Residential Property Tribunal: London region Weekly Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('Residential Property Midlands Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/rpt-midlands-weekly-hearing-list?artefactId=tuv';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'RPT_MIDLANDS_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('tuv').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Residential Property Tribunal: Midlands region Weekly Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('Residential Property Northern Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/rpt-northern-weekly-hearing-list?artefactId=xyz';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'RPT_NORTHERN_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('xyz').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Residential Property Tribunal: Northern region Weekly Hearing List',
                'Could not find the header'
            );
        });
    });

    describe('Residential Property Southern Weekly Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/rpt-southern-weekly-hearing-list?artefactId=def';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'RPT_SOUTHERN_WEEKLY_HEARING_LIST';

        metadataStub.withArgs('def').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Residential Property Tribunal: Southern region Weekly Hearing List',
                'Could not find the header'
            );
        });
    });
});
