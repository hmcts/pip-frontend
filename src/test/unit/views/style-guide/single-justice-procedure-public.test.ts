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
const summaryHeading = 'govuk-body';
const tableHeadings = 'govuk-table__header';
const sjpTableData = 'govuk-table__cell';
const buttonClass = 'govuk-button';
const linkClass = 'govuk-link';
const paginationClass = 'govuk-pagination__link';
const filterTitleClass = 'moj-filter__header-title';
const selectedFiltersHeadingClass = 'govuk-heading-m';

const summaryHeadingText = 'List containing 2 case(s)';
const listDate = '01 September 2023';
const offenderIndividualName = 'A This is a surname';
const offenderOrganisationName = 'This is an accused organisation name';
const offenderIndividualPostcode = 'AA';
const offenderOrganisationPostcode = 'A9';
const offenderProsecutor = 'This is a prosecutor organisation';
const offenderReason = 'This is an offence title';

let htmlRes: Document;

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp/minimalSjpPublicList.json'), 'utf-8');
const sjpList = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpFullList = JSON.parse(rawMetaData)[0];
metaDataSjpFullList.listType = 'SJP_PUBLIC_LIST';

const metaDataSjpNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PUBLIC_LIST';

const sjpFullListUrl = '/sjp-public-list';
const sjpNewCasesUrl = '/sjp-public-list-new-cases';

const sjpResourceMap = new Map<string, any>([
    [
        sjpFullListUrl,
        {
            artefactId: uuidv4(),
            artefactIdWithDownloadButton: uuidv4(),
            artefactIdWithPagination: uuidv4(),
            title: 'Single Justice Procedure cases that are ready for hearing (Full list)',
        },
    ],
    [
        sjpNewCasesUrl,
        {
            artefactId: uuidv4(),
            artefactIdWithDownloadButton: uuidv4(),
            artefactIdWithPagination: uuidv4(),
            title: 'Single Justice Procedure cases that are ready for hearing (New cases)',
        },
    ],
]);

const sjpFullListResource = sjpResourceMap.get(sjpFullListUrl);
const sjpNewCasesResource = sjpResourceMap.get(sjpNewCasesUrl);

const getJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');

getJsonStub.withArgs(sjpFullListResource['artefactId']).returns(sjpList);
getJsonStub.withArgs(sjpFullListResource['artefactIdWithDownloadButton']).returns(sjpList);
getJsonStub.withArgs(sjpNewCasesResource['artefactId']).returns(sjpList);
getJsonStub.withArgs(sjpNewCasesResource['artefactIdWithDownloadButton']).returns(sjpList);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListResource['artefactId']).returns(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactId']).returns(metaDataSjpNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithDownloadButton']).returns(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithDownloadButton']).returns(metaDataSjpNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithPagination']).returns(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithPagination']).returns(metaDataSjpNewCases);

const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'showDownloadButton');
generatesFilesStub.withArgs(sjpFullListResource['artefactId']).resolves(false);
generatesFilesStub.withArgs(sjpNewCasesResource['artefactId']).resolves(false);

describe('Single Justice Procedure List page', () => {
    describe.each([sjpFullListUrl, sjpNewCasesUrl])("user not signed in with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const pageUrl = url + '?artefactId=' + sjpResource.artefactId;

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
            expect(header[0].innerHTML).contains(sjpResource.title, 'Could not find the header');
        });

        it('should display summary', () => {
            const summary = htmlRes.getElementsByClassName(summaryHeading);
            expect(summary[0].innerHTML).contains(summaryHeadingText, 'Could not find the display summary heading');
            expect(summary[0].innerHTML).contains(listDate, 'Could not find the published date');
        });

        it('should display table headers correctly', () => {
            const tableHeaders = htmlRes.getElementsByClassName(tableHeadings);
            expect(tableHeaders[0].innerHTML).contains('Name');
            expect(tableHeaders[1].innerHTML).contains('Postcode');
            expect(tableHeaders[2].innerHTML).contains('Offence');
            expect(tableHeaders[3].innerHTML).contains('Prosecutor');
        });

        it('should have offender name (using individual details)', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[0].innerHTML).contains(offenderIndividualName, 'Could not find the offender name');
        });

        it('should have offender name (using organisation details)', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[4].innerHTML).contains(offenderOrganisationName, 'Could not find the offender name');
        });

        it('should have offender postcode (using individual details)', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[1].innerHTML).contains(offenderIndividualPostcode, 'Could not find the offender postcode');
        });

        it('should have offender postcode (using organisation details)', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[5].innerHTML).contains(
                offenderOrganisationPostcode,
                'Could not find the offender postcode'
            );
        });

        it('should have the offence reason', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[2].innerHTML).contains(offenderReason, 'Could not find the offence reason');
        });

        it('should have the correct prosecutor', () => {
            const tableData = htmlRes.getElementsByClassName(sjpTableData);
            expect(tableData[3].innerHTML).contains(offenderProsecutor, "Could not find the offender's prosecutor");
        });

        it('should display the show filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Show Filters', 'Could not find the show filters button');
        });
    });

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("signed in as media user with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);

        describe('with publication files', () => {
            const pageUrl = url + '?artefactId=' + sjpResource.artefactIdWithDownloadButton;

            generatesFilesStub
                .withArgs(sjpResource['artefactIdWithDownloadButton'], { roles: 'VERIFIED' })
                .resolves(true);

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
                expect(buttons[0].innerHTML).contains('Download a copy', 'Could not find the download button');
            });
        });

        describe('without publication files', () => {
            const pageUrl = url + '?artefactId=' + sjpResource.artefactId;

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

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("signed in as admin user with path '%s'", url => {
        const pageUrl = url + '?artefactId=' + sjpResourceMap.get(url).artefactId;

        beforeAll(async () => {
            app.request['user'] = { roles: 'INTERNAL_SUPER_ADMIN_CTSC' };

            await request(app)
                .get(pageUrl)
                .then(res => {
                    htmlRes = new DOMParser().parseFromString(res.text, 'text/html');
                    htmlRes.getElementsByTagName('div')[0].remove();
                });
        });

        it('should display the show filters button', () => {
            const buttons = htmlRes.getElementsByClassName(buttonClass);
            expect(buttons[0].innerHTML).contains('Show Filters', 'Could not find the show filters button');
        });
    });

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("Request with filter values with path '%s'", url => {
        const pageUrl = url + '?artefactId=' + sjpResourceMap.get(url).artefactId;

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

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("Test pagination appears correctly '%s'", url => {
        const pageUrl = url + '?artefactId=' + sjpResourceMap.get(url).artefactIdWithPagination + '&page=2';

        const copyOfRawData = JSON.parse(rawData);
        const courtLists = copyOfRawData['courtLists'] as object[];
        const courtList = courtLists[0];
        for (let i = 0; i < 2000; i++) {
            courtLists.push(courtList);
        }
        copyOfRawData['courtLists'] = courtLists;

        getJsonStub
            .withArgs(sjpResourceMap.get(url).artefactIdWithPagination)
            .returns(JSON.parse(JSON.stringify(copyOfRawData)));

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
            const links = htmlRes.getElementsByClassName('govuk-pagination__item--current');
            expect(links[0].innerHTML).contains('2', 'Could not find the currently selected page');
        });
    });
});
