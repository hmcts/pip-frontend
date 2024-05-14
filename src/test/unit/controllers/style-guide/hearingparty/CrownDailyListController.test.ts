import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../../main/service/PublicationService';
import { mockRequest } from '../../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../../../main/service/LocationService';
import CrownDailyListController from '../../../../../main/controllers/style-guide/CrownDailyListController';
import { CrimeListsService } from '../../../../../main/service/listManipulation/CrimeListsService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/hearingparty/crownDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CROWN_DAILY_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const crownDailyListController = new CrownDailyListController();

const crownDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CrimeListsService.prototype, 'manipulateCrimeListDataV1').returns(listData);
sinon.stub(CrimeListsService.prototype, 'findUnallocatedCasesInCrownDailyListData').returns(listData);

const artefactId = 'abc';
const artefactIdListNotFound = 'xyz';

crownDailyListJsonStub.withArgs(artefactId).resolves(listData);
crownDailyListJsonStub.withArgs(artefactId, undefined).resolves(undefined);
crownDailyListJsonStub.withArgs('').resolves([]);
crownDailyListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

crownDailyListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownDailyListMetaDataStub.withArgs('').resolves([]);
crownDailyListMetaDataStub.withArgs(artefactIdListNotFound).resolves(metaDataListNotFound);

const listType = 'crown-daily-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
    'list-template': {},
};

describe('Crown Daily List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/crown-daily-list';

    it('should render the crown daily list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData,
            contentDate: DateTime.fromISO(metaData['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '14 September 2020',
            courtName: "Abergavenny Magistrates' Court",
            publishedTime: '12:30am',
            provenance: 'prov1',
            version: '',
            venueAddress: 'THE LAW COURTS\nPR1 2LL',
            partyAtHearingLevel: true,
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await crownDailyListController.get(request, response);
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

        await crownDailyListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownDailyListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        request.query = { artefactId: artefactId };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownDailyListController.get(request, response);
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

        await crownDailyListController.get(request, response);
        return responseMock.verify();
    });
});
