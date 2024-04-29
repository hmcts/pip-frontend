import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';

const PAGE_URL = '/opa-results?artefactId=abc';
const WELSH_PAGE_URL = '/opa-results?artefactId=def&lng=cy';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaResults.json'), 'utf-8');
const jsonData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const englishMetadata = JSON.parse(rawMetadata)[0];
const welshMetadata = JSON.parse(rawMetadata)[2];

sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: 'Court name',
    welshName: 'Welsh court name',
});
sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(jsonData);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs('abc').returns(englishMetadata);
metadataStub.withArgs('def').returns(welshMetadata);

describe('OPA Results page', () => {
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
                'Online Plea and Allocation Results - Court name',
                'Header does not match'
            );
        });

        it('should display list content date', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[0].innerHTML).contains(
                'Results published on 14 February 2022',
                'List content date does not match'
            );
        });

        it('should display publication date', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[1].innerHTML).contains(
                'Last updated: 09 January 2024 at 11:30pm',
                'Publication date does not match'
            );
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

        it('should display the decision date headings', () => {
            let decisionDateHeading = htmlRes.getElementsByClassName('decision-date-1');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Allocation decisions made on 07 January 2024',
                'First decision date heading does not match'
            );

            decisionDateHeading = htmlRes.getElementsByClassName('decision-date-2');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Allocation decisions made on 06 January 2024',
                'Second decision date heading does not match'
            );

            decisionDateHeading = htmlRes.getElementsByClassName('decision-date-3');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Allocation decisions made on 05 January 2024',
                'Third decision date heading does not match'
            );
        });

        it('should display defendant name headings', () => {
            let defendantHeading = htmlRes.getElementById('accordion-default-heading-1');
            expect(defendantHeading.innerHTML).contains(
                'Defendant Name: Organisation name',
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-2');
            expect(defendantHeading.innerHTML).contains(
                'Defendant Name: Surname 2, Forename 2 MiddleName 2',
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-3');
            expect(defendantHeading.innerHTML).contains(
                'Defendant Name: Surname, Forename MiddleName',
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-4');
            expect(defendantHeading.innerHTML).contains(
                'Defendant Name: Surname 3, Forename 3 MiddleName 3',
                'Defendant name does not match'
            );
        });

        it('should display case URN', () => {
            const caseRef = htmlRes.getElementsByClassName('case-ref');

            expect(caseRef[0].innerHTML).contains('URN456', 'Case URN does not match');
            expect(caseRef[1].innerHTML).contains('URN456', 'Case URN does not match');
            expect(caseRef[2].innerHTML).contains('URN123', 'Case URN does not match');
            expect(caseRef[3].innerHTML).contains('URN789', 'Case URN does not match');
        });

        it('should display offence title and offence section', () => {
            const offence = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(offence[0].innerHTML).contains(
                '1. Offence title 2A - Offence section 2A',
                'Offence title and section does not match'
            );

            expect(offence[1].innerHTML).contains(
                '2. Offence title 2B - Offence section 2B',
                'Offence title and section does not match'
            );
        });

        it('should display offence table headers correctly', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__header');
            expect(cell[0].innerHTML).contains('Decision date', 'Decision date header does not match');
            expect(cell[1].innerHTML).contains('Allocation decision', 'Decision details header does not match');
            expect(cell[2].innerHTML).contains('Bail status', 'Bail status header does not match');
            expect(cell[3].innerHTML).contains('Next hearing date', 'Next hearing date header does not match');
            expect(cell[4].innerHTML).contains('Next hearing location', 'Next hearing location header does not match');
            expect(cell[5].innerHTML).contains(
                'Reporting restrictions',
                'Reporting restrictions header does not match'
            );
        });

        it('should display offence table values correctly', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[0].innerHTML).contains('07 January 2024', 'Decision date value does not match');
            expect(cell[1].innerHTML).contains('Decision detail 2A', 'Decision details value does not match');
            expect(cell[2].innerHTML).contains('Unconditional bail', 'Bail status value does not match');
            expect(cell[3].innerHTML).contains('10 February 2024', 'Next hearing date value does not match');
            expect(cell[4].innerHTML).contains('Hearing location 2', 'Next hearing location value does not match');
            expect(cell[5].innerHTML).contains(
                'Reporting restriction detail 2, Reporting restriction detail 3',
                'Reporting restrictions value does not match'
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
                'Canlyniadau Pledio a Dyrannu Ar-lein - Welsh court name',
                'Header does not match'
            );
        });

        it('should display list content date', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[0].innerHTML).contains(
                'Cyhoeddwyd y canlyniadau ar 14 Chwefror 2022',
                'List content date does not match'
            );
        });

        it('should display publication date', () => {
            const body = htmlRes.getElementsByClassName('govuk-body');
            expect(body[1].innerHTML).contains(
                'Diweddarwyd diwethaf: 09 Ionawr 2024 am 11:30pm',
                'Publication date does not match'
            );
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

        it('should display the decision date headings', () => {
            let decisionDateHeading = htmlRes.getElementsByClassName('decision-date-1');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Penderfyniadau dyrannu a wnaed ar 07 Ionawr 2024',
                'First decision date heading does not match'
            );

            decisionDateHeading = htmlRes.getElementsByClassName('decision-date-2');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Penderfyniadau dyrannu a wnaed ar 06 Ionawr 2024',
                'Second decision date heading does not match'
            );

            decisionDateHeading = htmlRes.getElementsByClassName('decision-date-3');
            expect(decisionDateHeading[0].innerHTML).contains(
                'Penderfyniadau dyrannu a wnaed ar 05 Ionawr 2024',
                'Third decision date heading does not match'
            );
        });

        it('should display defendant name headings', () => {
            let defendantHeading = htmlRes.getElementById('accordion-default-heading-1');
            expect(defendantHeading.innerHTML).contains(
                "Enw'r Diffynnydd: Organisation name",
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-2');
            expect(defendantHeading.innerHTML).contains(
                "Enw'r Diffynnydd: Surname 2, Forename 2 MiddleName 2",
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-3');
            expect(defendantHeading.innerHTML).contains(
                "Enw'r Diffynnydd: Surname, Forename MiddleName",
                'Defendant name does not match'
            );

            defendantHeading = htmlRes.getElementById('accordion-default-heading-4');
            expect(defendantHeading.innerHTML).contains(
                "Enw'r Diffynnydd: Surname 3, Forename 3 MiddleName 3",
                'Defendant name does not match'
            );
        });

        it('should display case URN', () => {
            const caseRef = htmlRes.getElementsByClassName('case-ref');

            expect(caseRef[0].innerHTML).contains('URN456', 'Case URN does not match');
            expect(caseRef[1].innerHTML).contains('URN456', 'Case URN does not match');
            expect(caseRef[2].innerHTML).contains('URN123', 'Case URN does not match');
            expect(caseRef[3].innerHTML).contains('URN789', 'Case URN does not match');
        });

        it('should display offence title and offence section', () => {
            const offence = htmlRes.getElementsByClassName('govuk-details__summary-text');
            expect(offence[0].innerHTML).contains(
                '1. Offence title 2A - Offence section 2A',
                'Offence title and section does not match'
            );

            expect(offence[1].innerHTML).contains(
                '2. Offence title 2B - Offence section 2B',
                'Offence title and section does not match'
            );
        });

        it('should display offence table headers correctly', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__header');
            expect(cell[0].innerHTML).contains('Dyddiad penderfynu', 'Decision date header does not match');
            expect(cell[1].innerHTML).contains('Penderfyniad dyrannu', 'Decision details header does not match');
            expect(cell[2].innerHTML).contains('Statws mechnïaeth', 'Bail status header does not match');
            expect(cell[3].innerHTML).contains(
                'Dyddiad y gwrandawiad nesaf',
                'Next hearing date header does not match'
            );
            expect(cell[4].innerHTML).contains(
                'Lleoliad y gwrandawiad nesaf',
                'Next hearing location header does not match'
            );
            expect(cell[5].innerHTML).contains('Cyfyngiadau riportio', 'Reporting restrictions header does not match');
        });

        it('should display offence table values correctly', () => {
            const cell = htmlRes.getElementsByClassName('govuk-table__cell');
            expect(cell[0].innerHTML).contains('07 Ionawr 2024', 'Decision date value does not match');
            expect(cell[1].innerHTML).contains('Decision detail 2A', 'Decision details value does not match');
            expect(cell[2].innerHTML).contains('Unconditional bail', 'Bail status value does not match');
            expect(cell[3].innerHTML).contains('10 Chwefror 2024', 'Next hearing date value does not match');
            expect(cell[4].innerHTML).contains('Hearing location 2', 'Next hearing location value does not match');
            expect(cell[5].innerHTML).contains(
                'Reporting restriction detail 2, Reporting restriction detail 3',
                'Reporting restrictions value does not match'
            );
        });
    });
});
