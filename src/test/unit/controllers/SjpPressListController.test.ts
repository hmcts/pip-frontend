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

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/SJPMockPage.json'), 'utf-8');
const sjpData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const sjpPressListController = new SjpPressListController();

const sjpPressListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sjpPressListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

const filter = { sjpCases: ['1', '2'], filterOptions: {} };
sinon.stub(SjpFilterService.prototype, 'generateFilters').returns(filter);

const artefactId = 'abc';

sjpPressListJsonStub.withArgs(artefactId).resolves(sjpData);
sjpPressListJsonStub.withArgs('').resolves([]);

sjpPressListMetaDataStub.withArgs(artefactId).resolves(metaData);
sjpPressListMetaDataStub.withArgs('').resolves([]);

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

    describe('get', () => {
        it('should render the SJP press list page', async () => {
            const request = mockRequest(i18n);
            request.user = { userId: '1' };

            request.query = { artefactId: artefactId, filterValues: '123' };

            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['single-justice-procedure-press'],
                ...i18n['list-template'],
                sjpData: filter.sjpCases,
                totalHearings: 2,
                publishedDateTime: '14 September 2016',
                publishedTime: '12:30am',
                contactDate: DateTime.fromISO(metaData['contentDate'], {
                    zone: 'utc',
                }).toFormat('d MMMM yyyy'),
                artefactId: 'abc',
                user: request.user,
                filters: filter.filterOptions,
                showFilters: true,
            };

            responseMock.expects('render').once().withArgs('single-justice-procedure-press', expectedData);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page is query param is empty', async () => {
            const request = mockRequest(i18n);
            request.query = {};
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page if list is not allowed to view by the user', async () => {
            const request = mockRequest(i18n);
            request.query = {};

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sjpPressListController.get(request, response);
            return responseMock.verify();
        });
    });

    describe('post', () => {
        it('should redirect to configure list page with correct filters', () => {
            const request = mockRequest(i18n);
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
