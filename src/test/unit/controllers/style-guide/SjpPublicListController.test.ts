import sinon from 'sinon';
import { Response } from 'express';
import { PublicationService } from '../../../../main/service/PublicationService';
import fs from 'fs';
import path from 'path';
import { mockRequest } from '../../mocks/mockRequest';
import SjpPublicListController from '../../../../main/controllers/style-guide/SjpPublicListController';
import { FilterService } from '../../../../main/service/FilterService';
import { SjpFilterService } from '../../../../main/service/SjpFilterService';
import { HttpStatusCode } from 'axios';
import { ListDownloadService } from '../../../../main/service/ListDownloadService';
import {describe} from "@jest/globals";

const sjpPublicListController = new SjpPublicListController();

const artefactIdListNotFound = 'xyz';

const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../../mocks/sjp-public-list.json'), 'utf-8');
const data = JSON.parse(mockSJPPublic);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaDataSjpFullList = JSON.parse(rawMetaData)[0];
metaDataSjpFullList.listType = 'SJP_PUBLIC_LIST';
const metaDataSjpNewCases = JSON.parse(rawMetaData)[0];
metaDataSjpNewCases.listType = 'SJP_DELTA_PUBLIC_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[0];

const sjpFullListName = 'single-justice-procedure';
const sjpNewCasesName = 'single-justice-procedure-new-cases';
const sjpFullListUrl = '/sjp-press-list';
const sjpNewCasesUrl = '/sjp-press-list-new-cases';

const sjpResourceMap = new Map<string, any>([
    [sjpFullListUrl, { artefactId: 'abc', artefactIdWithNoFiles: 'def', resourceName: sjpFullListName }],
    [sjpNewCasesUrl, { artefactId: 'ghi', artefactIdWithNoFiles: 'jkl', resourceName: sjpNewCasesName }],
]);

const sjpFullListResource = sjpResourceMap.get(sjpFullListUrl);
const sjpNewCasesResource = sjpResourceMap.get(sjpNewCasesUrl);
const sjpFullListPath = 'style-guide/single-justice-procedure';

const i18n = {
    'style-guide': {
        sjpFullListName: { header: 'Single Justice Procedure cases that are ready for hearing (Full list)' },
        sjpNewCasesName: { header: 'Single Justice Procedure cases that are ready for hearing (New cases)' },
        'sjp-common': { downloadButtonLabel: 'Download a copy' },
    },
    'list-template': {},
};

const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
jsonStub.withArgs(sjpFullListResource['artefactId']).resolves(data);
jsonStub.withArgs(sjpNewCasesResource['artefactId']).resolves(data);
jsonStub.withArgs(sjpFullListResource['artefactIdWithNoFiles']).resolves(data);
jsonStub.withArgs(sjpNewCasesResource['artefactIdWithNoFiles']).resolves(data);
jsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
metadataStub.withArgs(sjpFullListResource['artefactId']).resolves(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactId']).resolves(metaDataSjpNewCases);
metadataStub.withArgs(sjpFullListResource['artefactIdWithNoFiles']).resolves(metaDataSjpFullList);
metadataStub.withArgs(sjpNewCasesResource['artefactIdWithNoFiles']).resolves(metaDataSjpNewCases);
metadataStub.withArgs(artefactIdListNotFound).resolves(metaDataListNotFound);
metadataStub.withArgs('').resolves([]);

const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'showDownloadButton');
generatesFilesStub.withArgs(sjpFullListResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpNewCasesResource['artefactId']).resolves(true);
generatesFilesStub.withArgs(sjpFullListResource['artefactIdWithNoFiles']).resolves(false);
generatesFilesStub.withArgs(sjpNewCasesResource['artefactIdWithNoFiles']).resolves(false);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);
sinon.stub(FilterService.prototype, 'generateFilterKeyValues').returns('TestValue');

describe('SJP Public List Type Controller', () => {
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

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("get with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const expectedData = {
            ...i18n['style-guide'][sjpResource.resourceName],
            ...i18n['style-guide']['sjp-common'],
            ...i18n['list-template'],
            sjpData: filter.sjpCases,
            length: 2,
            publishedDateTime: '01 September 2023',
            publishedTime: '11am',
            filterOptions: filter.filterOptions,
        };

        it('should render the SJP public list page when filter string is provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: sjpResource.artefactId, filterValues: '123' };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpResource.artefactId,
                showFilters: true,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(sjpFullListPath, localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when no filter string provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: sjpResource.artefactId };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpResource.artefactId,
                showFilters: false,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(sjpFullListPath, localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when clear string is provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: sjpResource.artefactId, clear: 'all' };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpResource.artefactId,
                showFilters: true,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(sjpFullListPath, localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when no publication files exist', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId:  sjpResource.artefactIdWithNoFiles };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: sjpResource.artefactIdWithNoFiles,
                showFilters: false,
                showDownloadButton: false,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs(sjpFullListPath, localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page is query param is empty', async () => {
            request.query = {};
            request.user = { userId: '123' };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page if list is not allowed to view by the user', async () => {
            request.query = {};

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render list not found page if response is 404', async () => {
            request.query = { artefactId: '1234' };
            request.user = { userId: '123' };

            const responseMock = sinon.mock(response);
            responseMock
                .expects('render')
                .once()
                .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });
    });

    describe.each([sjpFullListUrl, sjpNewCasesUrl])("post with path '%s'", url => {
        const sjpResource = sjpResourceMap.get(url);
        const artefactId = sjpResource.artefactId;

        it('should redirect to configure list page with correct filters', () => {
            request.query = { artefactId: artefactId };

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs(`sjp-public-list?artefactId=${artefactId}&filterValues=TestValue`);

            return sjpPublicListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    it('should render list not found page if list type not valid', async () => {
        request.query = { artefactId: artefactIdListNotFound };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await sjpPublicListController.get(request, response);
        return responseMock.verify();
    });
});
