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

describe('SSCS Daily Hearing List Page', () => {
    const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
    const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sscsDailyHearingList.json'), 'utf-8');
    const jsonData = JSON.parse(rawData);

    sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);
    const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

    describe('Midlands Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-midlands-daily-hearing-list?artefactId=abc';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_MIDLANDS_DAILY_HEARING_LIST';

        metadataStub.withArgs('abc').returns(metaData);

        beforeAll(async () => {
            await request(app)
                .get(PAGE_URL)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                });
        });

        it('should have correct page title', () => {
            const pageTitle = htmlRes.title;
            expect(pageTitle).contains(
                'Midlands Social Security and Child Support Tribunal Daily Hearing List - Court and Tribunal Hearings - GOV.UK',
                'Could not find the page title'
            );
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).contains(
                'Midlands Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display fact link text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[4].innerHTML).contains('Find contact details and other information about courts and tribunals');
        });

        it('should display fact link', () => {
            const text = htmlRes.getElementsByClassName('govuk-link');
            expect(text[5].getAttribute('href')).eq('https://www.find-court-tribunal.service.gov.uk/');
        });

        it('should display list for text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[5].innerHTML).contains('List for 14 February 2022');
        });

        it('should display list updated date text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[6].innerHTML).contains('Last updated 20 January 2025 at 9:30am');
        });

        it('should display important information heading', () => {
            const text = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(text[0].innerHTML).contains('Important information');
        });

        it('should display open justice text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[7].innerHTML).contains(
                'Open justice is a fundamental principle of our justice system. When considering the ' +
                    'use of telephone and video technology, the judiciary will have regard to ' +
                    'the principles of open justice. Judges may determine that a hearing should ' +
                    'be held in private if this is necessary to secure the proper administration of justice.'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing ascbirmingham@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });

        it('should display observation text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[9].innerHTML).contains('For more information, please visit');
        });

        it('should display observation link', () => {
            const text = htmlRes.getElementsByClassName(govukLinkClass);
            expect(text[6].getAttribute('href')).eq('https://www.gov.uk/guidance/observe-a-court-or-tribunal-hearing');
        });

        it('should display Venue header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[0].innerHTML).contains('Venue');
        });

        it('should Appeal Reference Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[1].innerHTML).contains('Appeal reference number');
        });

        it('should Hearing Type header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[2].innerHTML).contains('Hearing type');
        });

        it('should display Appellant header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[3].innerHTML).contains('Appellant');
        });

        it('should display Courtroom Number header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[4].innerHTML).contains('Courtroom');
        });

        it('should display Hearing Time header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[5].innerHTML).contains('Hearing time');
        });

        it('should display Tribunal header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[6].innerHTML).contains('Tribunal');
        });

        it('should display FTA/Respondent header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[7].innerHTML).contains('FTA/Respondent');
        });

        it('should display Additional Information header', () => {
            const headerCell = htmlRes.getElementsByClassName(tableHeader);
            expect(headerCell[8].innerHTML).contains('Additional information');
        });

        it('should display Venue cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[0].innerHTML).contains('Venue 1');
        });

        it('should display Appeal Reference Number cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[1].innerHTML).contains('1234567');
        });

        it('should display Hearing Type cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[2].innerHTML).contains('Directions');
        });

        it('should display Appellant cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[3].innerHTML).contains('Appellant 1');
        });

        it('should display Courtroom data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[4].innerHTML).contains('Courtroom 1');
        });

        it('should display Hearing Time cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[5].innerHTML).contains('10:30am');
        });

        it('should display Tribunal cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[6].innerHTML)
                .contains('Tribunal member 1')
                .contains('Tribunal member 2')
                .contains('Tribunal member 3')
        });

        it('should display FTA/Respondent cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[7].innerHTML).contains('Respondent 1');
        });

        it('should display Additional Information cell data', () => {
            const cellText = htmlRes.getElementsByClassName(cell);
            expect(cellText[8].innerHTML).contains('Additional information 1');
        });

        it('should display data source text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[10].innerHTML).contains('Data Source: Prov1');
        });
    });

    describe('South East Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-south-east-daily-hearing-list?artefactId=mno';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_SOUTH_EAST_DAILY_HEARING_LIST';

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
                'South East Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscs_bradford@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });

    describe('Wales and South West Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-wales-and-south-west-daily-hearing-list?artefactId=tuv';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_WALES_AND_SOUTH_WEST_DAILY_HEARING_LIST';

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
                'Wales and South West Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscsa-cardiff@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });

    describe('Scotland Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-scotland-daily-hearing-list?artefactId=xyz';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_SCOTLAND_DAILY_HEARING_LIST';

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
                'Scotland Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscsa-glasgow@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });

    describe('North East Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-north-east-daily-hearing-list?artefactId=def';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_NORTH_EAST_DAILY_HEARING_LIST';

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
                'North East Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscsa-leeds@Justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });

    describe('North West Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-north-west-daily-hearing-list?artefactId=kju';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_NORTH_WEST_DAILY_HEARING_LIST';

        metadataStub.withArgs('kju').returns(metaData);

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
                'North West Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscsa-liverpool@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });

    describe('London Social Security and Child Support Tribunal Daily Hearing List', () => {
        let htmlRes: Document;
        const PAGE_URL = '/sscs-london-daily-hearing-list?artefactId=lon';

        const metaData = JSON.parse(rawMetaData)[0];
        metaData.listType = 'SSCS_LONDON_DAILY_HEARING_LIST';

        metadataStub.withArgs('lon').returns(metaData);

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
                'London Social Security and Child Support Tribunal Daily Hearing List',
                'Could not find the header'
            );
        });

        it('should display contact message text', () => {
            const text = htmlRes.getElementsByClassName(bodyText);
            expect(text[8].innerHTML).contains(
                'Social Security and Child Support Tribunal parties and representatives will be informed directly ' +
                    'as to the arrangements for hearing cases remotely. Any other person interested in joining ' +
                    'the hearing remotely should contact the Social Security and Child Support Tribunal Office ' +
                    'direct, in advance of the hearing date, by emailing sscsa-sutton@justice.gov.uk so that ' +
                    'arrangements can be made. The following details should be included in the subject line of ' +
                    'the email [OBSERVER/MEDIA] REQUEST – [case reference] – [hearing date]. If the case is to ' +
                    'be heard in private or is subject to a reporting restriction, this will be notified.'
            );
        });
    });
});
