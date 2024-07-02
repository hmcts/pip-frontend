import { expect } from 'chai';
import request from 'supertest';
import { app } from '../../../../main/app';
import fs from 'fs';
import path from 'path';
import sinon from 'sinon';
import { PublicationService } from '../../../../main/service/PublicationService';
import { ListDownloadService } from '../../../../main/service/ListDownloadService';
import { describe } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';

const headingClass = 'govuk-heading-l';
const summaryHeading = 'govuk-details__summary-text';
const listSummary = 'govuk-body govuk-!-font-weight-bold govuk-!-margin-bottom-1';
const offenderInformationClass = 'govuk-summary-list__value';
const bodyClass = 'govuk-body';
const buttonClass = 'govuk-button';
const linkClass = 'govuk-link';
const paginationClass = 'govuk-pagination__link';
const filterTitleClass = 'moj-filter__header-title';
const selectedFiltersHeadingClass = 'govuk-heading-m';

const summaryHeadingText = 'What are Single Justice Procedure cases?';
const listText = 'List for 14 February 2022';
const offenderIndividualName = 'Test Name';
const offenderOrganisationName = `Accused's org name`;
const offenderCaseNumber = 'Case URN';
const offenderIndividualAddress = 'Line 1 Line 2, Test Town, Test County, AA1 1AA';
const offenderOrganisationAddress = 'London, London, AA2 1AA';
const prosecutor = 'Organisation Name';
const reportingRestriction = 'Reporting Restriction - True';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp-press-list.json'), 'utf-8');
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

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
            artefactId: uuidv4(),
            artefactIdWithDownloadButton: uuidv4(),
            artefactIdWithPagination: uuidv4(),
            title: 'Single Justice Procedure cases - Press view (Full list)',
        },
    ],
    [
        sjpPressNewCasesUrl,
        {
            artefactId: uuidv4(),
            artefactIdWithDownloadButton: uuidv4(),
            artefactIdWithPagination: uuidv4(),
            title: 'Single Justice Procedure cases - Press view (New cases)',
        },
    ],
]);

const sjpFullListResource = sjpResourceMap.get(sjpPressFullListUrl);
const sjpNewCasesResource = sjpResourceMap.get(sjpPressNewCasesUrl);

const getJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');

getJsonStub.withArgs(sjpFullListResource['artefactId']).returns(sjpList);
getJsonStub.withArgs(sjpFullListResource['artefactIdWithDownloadButton']).returns(sjpList);
getJsonStub.withArgs(sjpNewCasesResource['artefactId']).returns(sjpList);
getJsonStub.withArgs(sjpNewCasesResource['artefactIdWithDownloadButton']).returns(sjpList);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListResource['artefactId']).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactId']).returns(metaDataSjpPressNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithDownloadButton']).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithDownloadButton']).returns(metaDataSjpPressNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithPagination']).returns(metaDataSjpPressFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithPagination']).returns(metaDataSjpPressNewCases);

const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'showDownloadButton');
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

        it('should display summary heading', () => {
            const summary = htmlRes.getElementsByClassName(summaryHeading);
            expect(summary[1].innerHTML).contains(
                'Important information',
                'Could not find the display summary heading'
            );
        });

        it('should display important info message', () => {
            const detail = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text');
            expect(detail[0].innerHTML).contains(
                'In accordance with the media protocol, additional documents ' +
                    'from these cases are available to the members of the media on request. ' +
                    'The link below takes you to the full protocol and further information ' +
                    'in relation to what documentation can be obtained',
                'Could not find the display summary heading'
            );
        });

        it('should display important info link', () => {
            const link = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text')
                .item(0)
                ?.getElementsByTagName('a');
            expect(link[0].getAttribute('href')).contains(
                'https://www.gov.uk/government/publications/' +
                    'guidance-to-staff-on-supporting-media-access-to-courts-and-tribunals/' +
                    'protocol-on-sharing-court-lists-registers-and-documents-with-the-media-accessible-version',
                'Could not find the display summary heading'
            );
        });

        it('should display important info link name', () => {
            const link = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text')
                .item(0)
                ?.getElementsByTagName('a');
            expect(link[0].innerHTML).contains(
                'Protocol on sharing court lists, registers and documents with the media',
                'Could not find the display summary heading'
            );
        });

        it('should display list date', () => {
            const offenderData = htmlRes.getElementsByClassName(listSummary);
            expect(offenderData[0].innerHTML).contains(listText, 'Could not find the list date information');
        });

        it('should have offender individual name', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[0].innerHTML).contains(offenderIndividualName, 'Could not find the offender name');
        });

        it('should have offender date of birth and age', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[1].innerHTML).contains(
                '1 January 1801 (200)',
                'Could not find the offender date of birth'
            );
        });

        it('should have offender date of birth only if age missing', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[11].innerHTML.replace(/\n/g, '').trim()).equals('1 January 1980');
        });

        it('should not have offender date of birth and age if fields missing', () => {
            const offenderData = htmlRes.getElementsByClassName(offenderInformationClass);
            expect(offenderData[16].innerHTML.replace(/\n/g, '').trim()).to.be.empty;
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
            const reportingRestrictionSection = htmlRes.getElementsByClassName(bodyClass);
            expect(reportingRestrictionSection[4].innerHTML).contains(
                reportingRestriction,
                'Could not find the reporting Restriction'
            );
        });

        it('should display the show filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Show Filters', 'Could not find the show filters button');
        });

        it('should display offence title and offence wording', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[5].innerHTML).contains(
                'This is an offence title - This is offence wording',
                'Offence text does not match'
            );
        });

        it('should display offence title only if no offence wording', () => {
            const body = htmlRes.getElementsByClassName(bodyClass);
            expect(body[7].innerHTML).contains('Another offence title', 'Offence text does not match');
            expect(body[7].innerHTML).not.contains('Another offence title -', 'Offence text does not match');
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
            expect(searchInput[0].innerHTML).contains(
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

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])('user with Welsh list', url => {
        const sjpResource = sjpResourceMap.get(url);

        const pageUrl = url + '?artefactId=' + sjpResource['artefactId'] + '&lng=cy';

        beforeAll(async () => {
            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display summary heading', () => {
            const summary = htmlRes.getElementsByClassName(summaryHeading);
            expect(summary[1].innerHTML).contains('Gwybodaeth Bwysig', 'Could not find the display summary heading');
        });

        it('should display important info message', () => {
            const detail = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text');
            expect(detail[0].innerHTML).contains(
                'Yn unol â phrotocol y cyfryngau, mae dogfennau ychwanegol ' +
                    'o’r achosion hyn ar gael i aelodau o’r cyfryngau ar gais. Bydd y ddolen isod yn mynd â chi at y ' +
                    'protocol llawn a gwybodaeth bellach ynghylch pa ddogfennau y gallwch ofyn amdanynt',
                'Could not find the display summary heading'
            );
        });

        it('should display important info link', () => {
            const link = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text')
                .item(0)
                ?.getElementsByTagName('a');
            expect(link[0].getAttribute('href')).contains(
                'https://www.gov.uk/government/publications/' +
                    'guidance-to-staff-on-supporting-media-access-to-courts-and-tribunals/' +
                    'protocol-on-sharing-court-lists-registers-and-documents-with-the-media-accessible-version',
                'Could not find the display summary heading'
            );
        });

        it('should display important info link name', () => {
            const link = htmlRes
                .getElementsByClassName('govuk-details')
                .item(1)
                .getElementsByClassName('govuk-details__text')
                .item(0)
                .getElementsByTagName('a');
            expect(link[0].innerHTML).contains(
                'Protocol ar rannu rhestrau’r llys a dogfennau gyda’r cyfryngau',
                'Could not find the display summary heading'
            );
        });
    });

    describe.each([sjpPressFullListUrl, sjpPressFullListUrl])("Test pagination appears correctly '%s'", url => {
        const pageUrl = url + '?artefactId=' + sjpResourceMap.get(url)['artefactIdWithPagination'] + '&page=2';

        let copyOfRawData = JSON.parse(rawData);
        const courtLists = copyOfRawData['courtLists'] as object[];
        const courtList = courtLists[0];
        for (let i = 0; i < 1000; i++) {
            courtLists.push(courtList);
        }
        copyOfRawData['courtLists'] = courtLists;

        getJsonStub.withArgs(sjpResourceMap.get(url)['artefactIdWithPagination']).returns(
            JSON.parse(JSON.stringify(copyOfRawData)));

        beforeAll(async () => {
            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the previous pagination button', () => {
            const links = htmlRes.getElementsByClassName(paginationClass);
            expect(links[0].innerHTML).contains('Previous', 'Could not find the Previous button');
        });

        it('should display the next', () => {
            const links = htmlRes.getElementsByClassName(paginationClass);
            expect(links[6].innerHTML).contains('Next', 'Could not find the Next button');
        });

        it('should display a non selected page button', () => {
            const links = htmlRes.getElementsByClassName(paginationClass);
            expect(links[1].innerHTML).contains('1', 'Could not find page 1');
        });

        it('should display the selected page button', () => {
            const links =
                htmlRes.getElementsByClassName('govuk-pagination__item--current');
            expect(links[0].innerHTML).contains('2', 'Could not find the currently selected page');
        });

    });
});
