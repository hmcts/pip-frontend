import sinon from 'sinon';
import { Response } from 'express';
import { PublicationService } from '../../../main/service/publicationService';
import fs from 'fs';
import path from 'path';
import { mockRequest } from '../mocks/mockRequest';
import SjpPublicListController from '../../../main/controllers/SjpPublicListController';
import { FilterService } from '../../../main/service/filterService';
import { SjpFilterService } from '../../../main/service/sjpFilterService';
import { HttpStatusCode } from 'axios';
import { ListDownloadService } from '../../../main/service/listDownloadService';

const sjpPublicListController = new SjpPublicListController();

const artefactId = '1';
const artefactIdWithNoFiles = '2';

const mockSJPPublic = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const data = JSON.parse(mockSJPPublic);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const i18n = { 'single-justice-procedure': {}, 'list-template': {} };
const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
jsonStub.withArgs(artefactId, '123').resolves(data);
jsonStub.withArgs(artefactIdWithNoFiles, '123').resolves(data);
jsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

const sjpPublicListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sjpPublicListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPublicListMetaDataStub.withArgs(artefactIdWithNoFiles).resolves(metaData);
sjpPublicListMetaDataStub.withArgs('').resolves([]);

const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'generateFiles');
generatesFilesStub.withArgs(artefactId).resolves(true);
generatesFilesStub.withArgs(artefactIdWithNoFiles).resolves(false);

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

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

    describe('get', () => {
        const expectedData = {
            ...i18n['single-justice-procedure-press'],
            ...i18n['sjp-common'],
            ...i18n['list-template'],
            sjpData: filter.sjpCases,
            length: 2,
            publishedDateTime: '14 September 2016',
            publishedTime: '12:30am',
            filterOptions: filter.filterOptions,
        };

        it('should render the SJP public list page when filter string is provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: artefactId, filterValues: '123' };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactId,
                showFilters: true,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('single-justice-procedure', localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when no filter string provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: artefactId };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactId,
                showFilters: false,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('single-justice-procedure', localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when clear string is provided', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: artefactId, clear: 'all' };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactId,
                showFilters: true,
                showDownloadButton: true,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('single-justice-procedure', localExpectedData);

            await sjpPublicListController.get(request, response);
            return responseMock.verify();
        });

        it('should render the SJP public list page when no publication files exist', async () => {
            request.user = { userId: '123' };
            request.query = { artefactId: artefactIdWithNoFiles };
            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactIdWithNoFiles,
                showFilters: false,
                showDownloadButton: false,
            };

            const responseMock = sinon.mock(response);
            responseMock.expects('render').once().withArgs('single-justice-procedure', localExpectedData);

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

    describe('post', () => {
        it('should redirect to configure list page with correct filters', () => {
            request.query = { artefactId: artefactId };

            sinon.stub(FilterService.prototype, 'generateFilterKeyValues').withArgs(request.body).returns('TestValue');

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('sjp-public-list?artefactId=1&filterValues=TestValue');

            return sjpPublicListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
