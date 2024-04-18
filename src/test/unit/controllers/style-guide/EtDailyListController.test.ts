import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/publicationService';
import { LocationService } from '../../../../main/service/locationService';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import EtDailyListController from '../../../../main/controllers/style-guide/EtDailyListController';
import { EtListsService } from '../../../../main/service/listManipulation/EtListsService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/etDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const etDailyListController = new EtDailyListController();

const etDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const etDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(EtListsService.prototype, 'reshapeEtLists').returns(listData);

const artefactId = 'abc';

etDailyListJsonStub.withArgs(artefactId).resolves(listData);
etDailyListJsonStub.withArgs('').resolves([]);
etDailyListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

etDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
etDailyListMetaDataStub.withArgs('').resolves([]);

const listType = 'et-daily-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
    'list-template': {},
};

describe('Et Daily List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/et-daily-list';

    it('should render the ET daily cause list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData,
            region: ['Bedford'],
            contentDate: '14 February 2022',
            publishedDate: '13 February 2022',
            publishedTime: '9:30am',
            courtName: "Abergavenny Magistrates' Court",
            provenance: 'prov1',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await etDailyListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        const request = mockRequest(i18n);
        request.query = {};
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await etDailyListController.get(request, response);
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

        await etDailyListController.get(request, response);
        return responseMock.verify();
    });
});
