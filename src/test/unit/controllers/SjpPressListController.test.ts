import sinon from 'sinon';
import { Response } from 'express';
import SjpPressListController from '../../../main/controllers/SjpPressListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { FilterService } from '../../../main/service/filterService';
import { SjpFilterService } from '../../../main/service/sjpFilterService';
import { ListDownloadService } from '../../../main/service/listDownloadService';
import { describe } from '@jest/globals';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/sjp-press-list.json'), 'utf-8');
const sjpData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSjpPressFullList = JSON.parse(rawMetaData)[0];
metaDataSjpPressFullList.listType = 'SJP_PRESS_LIST';

const metaDataSjpPressNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpPressNewCases.listType = 'SJP_DELTA_PRESS_LIST';

const sjpPressListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sjpPressListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'generateFiles');

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

const sjpPressFullListUrl = '/sjp-press-list';
const sjpPressNewCasesUrl = '/sjp-press-list-new-cases';

const sjpResourceMap = new Map<string, object>([
    [
        sjpPressFullListUrl,
        { artefactId: 'abc', artefactIdWithNoFiles: 'def', resourceName: 'single-justice-procedure-press' },
    ],
    [
        sjpPressNewCasesUrl,
        { artefactId: 'ghi', artefactIdWithNoFiles: 'jkl', resourceName: 'single-justice-procedure-press-new-cases' },
    ],
]);
const contentDate = metaDataSjpPressFullList['contentDate'];

const sjpPressFullListResource = sjpResourceMap.get(sjpPressFullListUrl);
const sjpPressNewCasesResource = sjpResourceMap.get(sjpPressNewCasesUrl);

sjpPressListJsonStub.withArgs(sjpPressFullListResource['artefactId']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(sjpData);
sjpPressListJsonStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(sjpData);
sjpPressListJsonStub.withArgs('').resolves([]);

sjpPressListMetaDataStub.withArgs(sjpPressFullListResource['artefactId']).resolves(metaDataSjpPressFullList);
sjpPressListMetaDataStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(metaDataSjpPressNewCases);
sjpPressListMetaDataStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(metaDataSjpPressFullList);
sjpPressListMetaDataStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(metaDataSjpPressNewCases);
sjpPressListMetaDataStub.withArgs('').resolves([]);

generatesFilesStub.withArgs(sjpPressFullListResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpPressNewCasesResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpPressFullListResource['artefactIdWithNoFiles']).resolves(false);
generatesFilesStub.withArgs(sjpPressNewCasesResource['artefactIdWithNoFiles']).resolves(false);

const i18n = {
    'single-justice-procedure-press': {
        header: 'Single Justice Procedure cases - Press view (Full list)',
    },
    'single-justice-procedure-press-new-cases': {
        header: 'Single Justice Procedure cases - Press view (New cases)',
    },
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
            sjpData: filter.sjpCases,
            totalHearings: 2,
            publishedDateTime: '14 September 2016',
            publishedTime: '12:30am',
            contactDate: DateTime.fromISO(contentDate, { zone: 'utc' }).toFormat('d MMMM yyyy'),
            filterOptions: filter.filterOptions,
            showDownloadButton: false,
            url: url.substring(1),
        };

        it('should render the SJP press list page when filter string is provided', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: sjpPressResource['artefactId'], filterValues: '123' };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpPressResource['artefactId'],
                showFilters: true,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('single-justice-procedure-press', localExpectedData);

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
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('single-justice-procedure-press', localExpectedData);

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
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('single-justice-procedure-press', localExpectedData);

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
                showDownloadButton: false,
            };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('single-justice-procedure-press', localExpectedData);

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
    });

    describe.each([sjpPressFullListUrl, sjpPressNewCasesUrl])("post with path '%s'", url => {
        const sjpPressResource = sjpResourceMap.get(url);

        afterEach(() => {
            sinon.restore();
        });

        it('should redirect to configure list page with correct filters', () => {
            const artefactId = sjpPressResource['artefactId'];
            request.query = { artefactId: artefactId };

            sinon.stub(FilterService.prototype, 'generateFilterKeyValues').withArgs(request.body).returns('TestValue');

            const responseMock = sinon.mock(response);
            responseMock
                .expects('redirect')
                .once()
                .withArgs(`sjp-press-list?artefactId=${artefactId}&filterValues=TestValue`);

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
