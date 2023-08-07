import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../main/service/publicationService';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import { describe } from '@jest/globals';

const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const listSummary = 'govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1';
const offenderInformationClass = 'govuk-summary-list__value';
const reportingRestrictionClass = 'govuk-body';
const buttonClass = 'govuk-button';
const linkClass = 'govuk-link';
const filterTitleClass = 'moj-filter__header-title';
const selectedFiltersHeadingClass = 'govuk-heading-m';

const summaryHeadingText = 'What are Single Justice Procedure cases?';
const listText = 'List for 14 February 2022';
const offenderIndividualName = 'Test Name';
const offenderOrganisationName = `Accused's org name`;
const offenderDateOfBirth = '1 January 1801';
const offenderCaseNumber = 'Case URN';
const offenderIndividualAddress = 'Line 1 Line 2, Test Town, Test County, TEST POSTCODE';
const offenderOrganisationAddress = 'London, London, TEST POSTCODE';
const prosecutor = 'Organisation Name';
const reportingRestriction = 'Reporting Restriction - True';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/sjp-press-list.json'), 'utf-8');
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpPressFullList = JSON.parse(rawMetaData)[0];
metaDataSjpPressFullList.listType = 'SJP_PRESS_LIST';

const metaDataSjpPressNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpPressNewCases.listType = 'SJP_DELTA_PRESS_LIST';

const sjpPressFullListUrl = '/sjp-press-list';
const sjpPressNewCasesUrl = '/sjp-press-list-new-cases';

const sjpResourceMap = new Map<string, object>([
    [
        sjpPressFullListUrl,
        {
            artefactId: 'abc',
            artefactIdWithDownloadButton: 'def',
            title: 'Single Justice Procedure cases - Press view (Full list)',
        },
    ],
    [
        sjpPressNewCasesUrl,
        {
            artefactId: 'ghi',
            artefactIdWithDownloadButton: 'jkl',
            title: 'Single Justice Procedure cases - Press view (New cases)',
        },
    ],
]);

const sjpFullListResource = sjpResourceMap.get(sjpPressFullListUrl);
const sjpNewCasesResource = sjpResourceMap.get(sjpPressNewCasesUrl);

sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson').returns(sjpList);
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListResource['artefactId']).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactId']).returns(metaDataSjpPressNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithDownloadButton']).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithDownloadButton']).returns(metaDataSjpPressNewCases);

const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'generateFiles');
generatesFilesStub.withArgs(sjpFullListResource['artefactId']).resolves(false);
generatesFilesStub.withArgs(sjpNewCasesResource['artefactId']).resolves(false);

describe('Single Justice Procedure List page', () => {
    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("user not signed in with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const pageUrl = url + '?artefactId=' + sjpResource['artefactId'];

        beforeAll(async () => {
            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display header', () => {
            const header = htmlRes.getElementsByClassName(headingClass);
            expect(header[0].innerHTML).equals(sjpResource['title'], 'Could not find the header');
        });

        it('should display summary', () => {
            const summary = htmlRes.getElementsByClassName(summaryHeading);
            expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
        });

        it('should display list date', () => {
            const offenderData = htmlRes.getElementsByClassName(listSummary);
            expect(offenderData[0].innerHTML).contains(listText, 'Could not find the list date information');
        });

        it('should display the search input box', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
            expect(searchInput[0].innerHTML).contains('Search Cases');
        });

        it('should have offender individual name', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[0].innerHTML).contains(offenderIndividualName, 'Could not find the offender name');
        });

        it('should have offender date of birth', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[1].innerHTML).contains(
                offenderDateOfBirth,
                'Could not find the offender date of birth'
            );
        });

        it('should have offender Case Reference', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[2].innerHTML).contains(
                offenderCaseNumber,
                'Could not find the offender case reference'
            );
        });

        it('should have offender individual address', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[3].innerHTML).contains(
                offenderIndividualAddress,
                'Could not find the offender individual address'
            );
        });

        it('should have empty offender individual address if address field is missing', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[13].innerHTML.replace(/\n/g, '').trim()).to.be.empty;
        });

        it('should have empty offender individual address if address field is empty', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[18].innerHTML.replace(/\n/g, '').trim()).to.be.empty;
        });

        it('should have prosecutor', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[4].innerHTML).contains(prosecutor, 'Could not find the Prosecutor');
        });

        it('should have offender organisation name', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[5].innerHTML).contains(offenderOrganisationName, 'Could not find the offender name');
        });

        it('should have offender organisation address', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[8].innerHTML).contains(
                offenderOrganisationAddress,
                'Could not find the offender organisation address'
            );
        });

        it('should have reporting restriction section', () => {
            const reportingRestrictionSection = htmlRes.getElementsByClassName(reportingRestrictionClass);
            expect(reportingRestrictionSection[4].innerHTML).contains(
                reportingRestriction,
                'Could not find the reporting Restriction'
            );
        });

        it('should display the show filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Show Filters', 'Could not find the show filters button');
        });
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("signed in as media user with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const pageUrl = url + '?artefactId=' + sjpResource['artefactId'];
        const pageUrlWithDownloadButton = url + '?artefactId=' + sjpResource['artefactIdWithDownloadButton'];

        describe('with publication files', () => {
            generatesFilesStub
                .withArgs(sjpResource['artefactIdWithDownloadButton'], { roles: 'VERIFIED' })
                .resolves(true);

            beforeAll(async () => {
                app.request['user'] = { roles: 'VERIFIED' };

                await request(app)
                    .get(pageUrlWithDownloadButton)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                        htmlRes.getElementsByTagName('div')[0].remove();
                    });
            });

            it('should display the download button', () => {
                const buttons = htmlRes.getElementsByClassName(buttonClass);
                expect(buttons[0].innerHTML).contains('Download a copy', 'Could not find the download button');
            });
        });

        describe('without publication files', () => {
            beforeAll(async () => {
                app.request['user'] = { roles: 'VERIFIED' };

                await request(app)
                    .get(pageUrl)
                    .then(res => {
                        htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                        htmlRes.getElementsByTagName('div')[0].remove();
                    });
            });

            it('should display the download button', () => {
                const buttons = htmlRes.getElementsByClassName(buttonClass);
                expect(buttons[0].innerHTML).not.contains('Download a copy', 'Could find the download button');
            });
        });
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("signed in as admin user with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const pageUrl = url + '?artefactId=' + sjpResource['artefactId'];

        beforeAll(async () => {
            app.request['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should not display the download button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).to.not.contains('Download a copy', 'The download button could be found');
        });
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("Request with filter values with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const pageUrl = url + '?artefactId=' + sjpResource['artefactId'];

        beforeAll(async () => {
            app.request['user'] = {};

            await request(app)
                .get(pageUrl + '&filterValues=AA1')
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });
        it('should display the hide filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Hide Filters', 'Could not find the hide filters button');
        });

        it('should display the filter title', () => {
            const title = htmlRes.getElementsByClassName(filterTitleClass);
            expect(title[0].innerHTML).contains('Filter', 'Could not find the filter title');
        });

        it('should display the selected filters heading', () => {
            const heading = htmlRes.getElementsByClassName(selectedFiltersHeadingClass);
            expect(heading[0].innerHTML).contains('Filter', 'Could not find the selected filters heading');
        });

        it('should display the clear filters link', () => {
            const links = htmlRes.getElementsByClassName(linkClass);
            expect(links[2].innerHTML).contains('Clear filters', 'Could not find the clear filters link');
        });

        it('should display the apply filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[1].innerHTML).contains('Apply filters', 'Could not find the apply filters button');
        });

        it('should display the search filters box', () => {
            const searchInput = htmlRes.getElementsByClassName('govuk-form-group');
            expect(searchInput[1].innerHTML).contains(
                'Search filters',
                'Could not find the search filters search box title'
            );
        });

        it('should display the postcode section', () => {
            const links = htmlRes.getElementsByClassName(linkClass);
            expect(links[3].innerHTML).contains('Postcode', 'Could not find the postcode section');
        });

        it('should display the prosecutor section', () => {
            const links = htmlRes.getElementsByClassName(linkClass);
            expect(links[4].innerHTML).contains('Prosecutor', 'Could not find the prosecutor section');
        });
    });
});
