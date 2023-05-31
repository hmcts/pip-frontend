import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { LocationService } from '../../../main/service/locationService';
import { CrimeListsService } from '../../../main/service/listManipulation/CrimeListsService';
import CrownFirmListController from '../../../main/controllers/CrownFirmListController';
import { CrownFirmListService } from '../../../main/service/listManipulation/crownFirmListService';
import { CivilFamilyAndMixedListService } from '../../../main/service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';

const fullyProcessedData = fs.readFileSync(path.resolve(__dirname, '../mocks/firmlistfullyprocessed.json'), 'utf-8');
const listData = JSON.parse(fullyProcessedData);

const unprocessed = fs.readFileSync(path.resolve(__dirname, '../mocks/crownFirmList.json'), 'utf-8');
const unprocessedData = JSON.parse(unprocessed);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const crownFirmListController = new CrownFirmListController();

const crownFirmListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownFirmListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[6]);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').returns(listData);
sinon.stub(CrimeListsService.prototype, 'manipulateCrimeListData').returns(listData);
sinon.stub(CrimeListsService.prototype, 'findUnallocatedCasesInCrownDailyListData').returns(listData);
sinon.stub(CrownFirmListService.prototype, 'splitOutFirmListData').returns(listData);

const artefactId = 'abc';

crownFirmListJsonStub.withArgs(artefactId).resolves(unprocessedData);
crownFirmListJsonStub.withArgs('').resolves([]);
crownFirmListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

crownFirmListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownFirmListMetaDataStub.withArgs('').resolves([]);

const i18n = {
    'crown-firm-list': {},
    'list-template': {},
};

describe('Crown Firm List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/crown-firm-list';

    it('should render the crown firm list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['crown-firm-list'],
            ...i18n['list-template'],
            listData,
            allocated: JSON.parse(fullyProcessedData),
            contentDate: '14 February 2022',
            publishedDate: '03 March 2023',
            startDate: '12 April 2023',
            endDate: '15 April 2023',
            publishedTime: '2:07pm',
            provenance: 'prov1',
            version: '3.4',
            courtName: 'Altrincham County Court and Family Court',
            bill: false,
        };

        responseMock.expects('render').once().withArgs('crown-firm-list', expectedData);

        await crownFirmListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownFirmListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.query = { artefactId: '1234' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await crownFirmListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        sinon.restore();
        request.query = { artefactId: artefactId };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownFirmListController.get(request, response);
        return responseMock.verify();
    });
});
