import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import IacDailyListController from '../../../../main/controllers/style-guide/IacDailyListController';
import { PublicationService } from '../../../../main/service/PublicationService';
import { IacDailyListService } from '../../../../main/service/listManipulation/IacDailyListService';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { HttpStatusCode } from 'axios';
import { describe } from '@jest/globals';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/iacDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'IAC_DAILY_LIST';

const metaDataAdditionalCases = JSON.parse(rawMetaData)[0];
metaDataAdditionalCases.listType = 'IAC_DAILY_LIST_ADDITIONAL_CASES';

metaData.listType = 'IAC_DAILY_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[0];

const iacDailyListController = new IacDailyListController();

const iacDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const iacDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(IacDailyListService.prototype, 'manipulateIacDailyListData').returns(listData);

const artefactId = 'abc';
const additionalCasesArtefactId = 'abcd';
const artefactIdListNotFound = 'xyz';

iacDailyListJsonStub.withArgs(artefactId).resolves(listData);
iacDailyListJsonStub.withArgs(additionalCasesArtefactId).resolves(listData);
iacDailyListJsonStub.withArgs(undefined).resolves(null);
iacDailyListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

iacDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
iacDailyListMetaDataStub.withArgs(additionalCasesArtefactId).resolves(metaDataAdditionalCases);

iacDailyListMetaDataStub.withArgs(undefined).resolves(null);
iacDailyListMetaDataStub.withArgs(artefactIdListNotFound).resolves(metaDataListNotFound);

const iacMainListUrl = '/iac-daily-list';
const iacAdditionalCasesListUrl = '/iac-daily-list-additional-cases';

const listType = 'iac-daily-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        'iac-daily-list': { value: '123' },
        'iac-daily-list-additional-cases': { value: '12345' },
    },
    'list-template': {},
};

describe('IAC Daily List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    describe.each([iacMainListUrl, iacAdditionalCasesListUrl])("get with path '%s'", url => {
        request.path = url;
        metaData.listType = url.substring(1).toUpperCase();

        it('should render the IAC daily list page', async () => {
            let artefactIdToUse = url == iacMainListUrl ? artefactId : additionalCasesArtefactId;
            request.query = { artefactId: artefactIdToUse };
            request.user = { userId: '1' };

            const responseMock = sinon.mock(response);
            let expectedData = {
                ...i18n['style-guide']['iac-daily-list'],
                ...i18n['list-template'],
                listData,
                contentDate: DateTime.fromISO(metaData['contentDate'], {
                    zone: 'utc',
                }).toFormat('dd MMMM yyyy'),
                publishedDate: '31 August 2022',
                publishedTime: '11am',
                provenance: 'prov1',
            };

            if (url === iacAdditionalCasesListUrl) {
                expectedData = {
                    ...expectedData,
                    ...i18n['style-guide']['iac-daily-list-additional-cases'],
                };
            }

            responseMock.expects('render').once().withArgs(listPath, expectedData);

            await iacDailyListController.get(request, response);
            return responseMock.verify();
        });

        it('should render list not found page if response is 404', async () => {
            const request = mockRequest(i18n);
            request.query = { artefactId: '1234' };
            request.user = { userId: '123' };

            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

            await iacDailyListController.get(request, response);
            return responseMock.verify();
        });

        it('should render error page if query param is empty', async () => {
            const request = mockRequest(i18n);
            request.query = {};
            request.user = { userId: '123' };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await iacDailyListController.get(request, response);
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

            await iacDailyListController.get(request, response);
            return responseMock.verify();
        });
    });
});
