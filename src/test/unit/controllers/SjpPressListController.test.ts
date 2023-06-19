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
import {ListDownloadService} from "../../../main/service/listDownloadService";

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const sjpData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const sjpPressListController = new SjpPressListController();

const sjpPressListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sjpPressListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
const generatesFilesStub = sinon.stub(ListDownloadService.prototype, 'generateFiles');

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

const artefactId = 'abc';
const artefactIdWithNoFiles = 'def';

sjpPressListJsonStub.withArgs(artefactId).resolves(sjpData);
sjpPressListJsonStub.withArgs(artefactIdWithNoFiles).resolves(sjpData);
sjpPressListJsonStub.withArgs('').resolves([]);

sjpPressListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPressListMetaDataStub.withArgs(artefactIdWithNoFiles).resolves(metaData);
sjpPressListMetaDataStub.withArgs('').resolves([]);

generatesFilesStub.withArgs(artefactId).resolves(true);
generatesFilesStub.withArgs(artefactIdWithNoFiles).resolves(false);

const i18n = {
    'single-justice-procedure-press': {},
    'list-template': {},
};

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

    const expectedData = {
        ...i18n['single-justice-procedure-press'],
        ...i18n['sjp-common'],
        ...i18n['list-template'],
        sjpData: filter.sjpCases,
        totalHearings: 2,
        publishedDateTime: '14 September 2016',
        publishedTime: '12:30am',
        contactDate: DateTime.fromISO(metaData['contentDate'], {
            zone: 'utc',
        }).toFormat('d MMMM yyyy'),
        filterOptions: filter.filterOptions,
        showDownloadButton: false,
    };

    describe('get', () => {
        it('should render the SJP press list page when filter string is provided', async () => {
            request.user = { userId: '1' };
            request.query = { artefactId: artefactId, filterValues: '123' };

            const localExpectedData = {
                ...expectedData, user:
                request.user,
                artefactId: artefactId,
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
            request.query = { artefactId: artefactId };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactId,
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
            request.query = { artefactId: artefactId, clear: 'all' };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactId,
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
            request.query = { artefactId: artefactIdWithNoFiles };

            const localExpectedData = {
                ...expectedData,
                user: request.user,
                artefactId: artefactIdWithNoFiles,
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

    describe('post', () => {
        it('should redirect to configure list page with correct filters', () => {
            request.query = { artefactId: artefactId };

            sinon.stub(FilterService.prototype, 'generateFilterKeyValues').withArgs(request.body).returns('TestValue');

            const responseMock = sinon.mock(response);
            responseMock.expects('redirect').once().withArgs('sjp-press-list?artefactId=abc&filterValues=TestValue');

            return sjpPressListController.filterValues(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
