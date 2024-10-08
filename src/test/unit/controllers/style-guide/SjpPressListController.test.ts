import sinon from 'sinon';
import { Response } from 'express';
import SjpPressListController from '../../../../main/controllers/style-guide/SjpPressListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { FilterService } from '../../../../main/service/FilterService';
import { SjpFilterService } from '../../../../main/service/SjpFilterService';
import { ListDownloadService } from '../../../../main/service/ListDownloadService';
import { describe } from '@jest/globals';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp/minimalSjpPressList.json'), 'utf-8');
const sjpData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpPressFullList = JSON.parse(rawMetaData)[0];
metaDataSjpPressFullList.listType = 'SJP_PRESS_LIST';
const metaDataSjpPressNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpPressNewCases.listType = 'SJP_DELTA_PRESS_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[0];

const sjpPressListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sjpPressListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'showDownloadButton');

const sjpPressFullListName = 'single-justice-procedure-press';
const sjpPressNewCasesName = 'single-justice-procedure-press-new-cases';
const sjpPressFullListUrl = 'sjp-press-list';
const sjpPressNewCasesUrl = 'sjp-press-list-new-cases';

const sjpResourceMap = new Map<string, object>([
    [
        sjpPressFullListUrl,
        { artefactId: uuidv4(), artefactIdWithNoFiles: uuidv4(), resourceName: sjpPressFullListName },
    ],
    [
        sjpPressNewCasesUrl,
        { artefactId: uuidv4(), artefactIdWithNoFiles: uuidv4(), resourceName: sjpPressNewCasesName },
    ],
]);
const artefactIdListNotFound = uuidv4();
const artefactIdMetaDataNotFound = uuidv4();
const contentDate = metaDataSjpPressFullList['contentDate'];

const sjpPressFullListResource = sjpResourceMap.get(sjpPressFullListUrl);
const sjpPressNewCasesResource = sjpResourceMap.get(sjpPressNewCasesUrl);
const sjpPressFullListPath = 'style-guide/single-justice-procedure-press';

sjpPressListJsonStub.withArgs(sjpPressFullListResource['artefactId']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(sjpData);
sjpPressListJsonStub.withArgs('').resolves([]);

sjpPressListMetaDataStub.withArgs(sjpPressFullListResource['artefactId']).resolves(metaDataSjpPressFullList);
sjpPressListMetaDataStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(metaDataSjpPressNewCases);
sjpPressListMetaDataStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(metaDataSjpPressFullList);
sjpPressListMetaDataStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(metaDataSjpPressNewCases);
sjpPressListMetaDataStub.withArgs(artefactIdListNotFound).resolves(metaDataListNotFound);
sjpPressListMetaDataStub.withArgs(artefactIdMetaDataNotFound).resolves(HttpStatusCode.NotFound);
sjpPressListMetaDataStub.withArgs('').resolves([]);

generatesFilesStub.withArgs(sjpPressFullListResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(false);
generatesFilesStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(false);

const generateKeyValuesStub = sinon.stub(FilterService.prototype, 'generateFilterKeyValues');
generateKeyValuesStub.withArgs({}).returns(['TestValue']);

const paginationData = { previous: { href: 'abcd' } };
sinon.stub(SjpFilterService.prototype, 'generatePaginationData').returns(paginationData);

const i18n = {
    sjpPressFullListName: { header: 'Single Justice Procedure cases - Press view (Full list)' },
    sjpPressNewCasesName: { header: 'Single Justice Procedure cases - Press view (New cases)' },
    'sjp-common': { downloadButtonLabel: 'Download a copy' },
    'list-template': {},
};

const sjpPressListController = new SjpPressListController();

describe('SJP Press List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
        redirect: function () {
            return '';
        },
    } as unknown as Response;

    let request;

    beforeEach(() => {
        request = mockRequest(i18n);
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("get with path '%s'", url => {
        const sjpPressResource = sjpResourceMap.get(url);
        const expectedData = {
            ...i18n[sjpPressResource['resourceName']],
            ...i18n['sjp-common'],
            ...i18n['list-template'],
            paginationData: paginationData,
            publishedDateTime: '14 September 2016',
            publishedTime: '12:30am',
            contactDate: DateTime.fromISO(contentDate, { zone: 'utc' }).toFormat('d MMMM yyyy'),
            showDownloadButton: false,
            listUrl: url,
        };

        it('should render the SJP press list page when filter string is provided', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: sjpPressResource['artefactId'], filterValues: 'AA1' };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpPressResource['artefactId'],
                showFilters: true,
                totalHearings: 1,
                showDownloadButton: true,
                sjpData: [
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA1 1AA',
                        postcode: 'AA1 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                ],
                filterOptions: {
                    postcodes: [
                        {
                            value: 'AA1',
                            text: 'AA1',
                            checked: true,
                        },
                        {
                            value: 'AA2',
                            text: 'AA2',
                            checked: false,
                        },
                    ],
                    prosecutor: [
                        {
                            value: 'OrganisationName',
                            text: 'Organisation Name',
                            checked: false,
                        },
                    ],
                },
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs(sjpPressFullListPath, localExpectedData);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP press list page when no filter string provided', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: sjpPressResource['artefactId'] };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpPressResource['artefactId'],
                showFilters: false,
                showDownloadButton: true,
                totalHearings: 2,
                sjpData: [
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA1 1AA',
                        postcode: 'AA1 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA2 1AA',
                        postcode: 'AA2 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                ],
                filterOptions: {
                    postcodes: [
                        {
                            value: 'AA1',
                            text: 'AA1',
                            checked: false,
                        },
                        {
                            value: 'AA2',
                            text: 'AA2',
                            checked: false,
                        },
                    ],
                    prosecutor: [
                        {
                            value: 'OrganisationName',
                            text: 'Organisation Name',
                            checked: false,
                        },
                    ],
                },
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs(sjpPressFullListPath, localExpectedData);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP press list page when only clear string provided', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: sjpPressResource['artefactId'], clear: 'all' };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpPressResource['artefactId'],
                showFilters: true,
                totalHearings: 2,
                showDownloadButton: true,
                sjpData: [
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA1 1AA',
                        postcode: 'AA1 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA2 1AA',
                        postcode: 'AA2 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                ],
                filterOptions: {
                    postcodes: [
                        {
                            value: 'AA1',
                            text: 'AA1',
                            checked: false,
                        },
                        {
                            value: 'AA2',
                            text: 'AA2',
                            checked: false,
                        },
                    ],
                    prosecutor: [
                        {
                            value: 'OrganisationName',
                            text: 'Organisation Name',
                            checked: false,
                        },
                    ],
                },
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs(sjpPressFullListPath, localExpectedData);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP press list page when no publication files exist', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: sjpPressResource['artefactIdWithNoFiles'] };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpPressResource['artefactIdWithNoFiles'],
                showFilters: false,
                totalHearings: 2,
                showDownloadButton: false,
                sjpData: [
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA1 1AA',
                        postcode: 'AA1 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                    {
                        name: 'Test Name',
                        dob: '1 January 1801',
                        age: 200,
                        address: 'Line 1 Line 2, Test Town, Test County, AA2 1AA',
                        postcode: 'AA2 1AA',
                        prosecutorName: 'Organisation Name',
                        caseUrn: 'Case URN',
                        offences: [
                            {
                                reportingRestrictionFlag: 'True',
                                offenceTitle: 'This is an offence title',
                                offenceWording: 'This is offence wording',
                            },
                        ],
                    },
                ],
                filterOptions: {
                    postcodes: [
                        {
                            value: 'AA1',
                            text: 'AA1',
                            checked: false,
                        },
                        {
                            value: 'AA2',
                            text: 'AA2',
                            checked: false,
                        },
                    ],
                    prosecutor: [
                        {
                            value: 'OrganisationName',
                            text: 'Organisation Name',
                            checked: false,
                        },
                    ],
                },
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs(sjpPressFullListPath, localExpectedData);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page is query param is empty', async () => {
            request.query = {};
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page if list is not allowed to view by the user', async () => {
            request.query = {};

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render list not found page if list type not valid', async () => {
            request.query = { artefactId: artefactIdListNotFound };
            request.user = { userId: '1' };
            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("post with path '%s'", url => {
        const sjpPressResource = sjpResourceMap.get(url);

        it('should redirect to configure list page with correct filters', () => {
            const artefactId = sjpPressResource['artefactId'];
            request.query = { artefactId: artefactId };
            request.body = {};

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs(`${url}?artefactId=${artefactId}&filterValues=TestValue`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to configure list page with a concatenated string when multiple filters selected', () => {
            request.body = { value1: 'value1', value2: 'value2' };
            generateKeyValuesStub.withArgs(request.body).returns(['value1', 'value2']);

            const artefactId = sjpPressResource['artefactId'];
            request.query = { artefactId: artefactId };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('redirect')
                .once()
                .withArgs(`${url}?artefactId=${artefactId}&filterValues=value1%2Cvalue2`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to error page if invalid artefact ID provided', () => {
            request.query = { artefactId: 'abcd' };
            request.body = {};

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(`error`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to error page if no artefact ID provided', () => {
            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(`error`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render error page when metaData not found', () => {
            request.query = { artefactId: artefactIdMetaDataNotFound };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(`error`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
