import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../../main/service/publicationService';
import { mockRequest } from '../../../mocks/mockRequest';
import { LocationService } from '../../../../../main/service/locationService';
import CrownFirmListController from '../../../../../main/controllers/style-guide/CrownFirmListController';
import { CrownFirmListService } from '../../../../../main/service/listManipulation/crownFirmListService';
import { HttpStatusCode } from 'axios';
import { DateTime } from 'luxon';

const listData = [
    {
        courtName: 'Court 1',
        days: [],
    },
];

const sittingDates = [
    DateTime.fromFormat('12 April 2023', 'dd MMMM yyyy', { zone: 'utc' }),
    DateTime.fromFormat('13 April 2023', 'dd MMMM yyyy', { zone: 'utc' }),
    DateTime.fromFormat('15 April 2023', 'dd MMMM yyyy', { zone: 'utc' }),
];

const unprocessed = fs.readFileSync(path.resolve(__dirname, '../../../mocks/hearingparty/crownFirmList.json'), 'utf-8');
const unprocessedData = JSON.parse(unprocessed);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const crownFirmListController = new CrownFirmListController();

const crownFirmListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownFirmListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[6]);
sinon.stub(CrownFirmListService.prototype, 'splitOutFirmListDataV1').returns(listData);
sinon.stub(CrownFirmListService.prototype, 'getSittingDates').returns(sittingDates);

const artefactId = 'abc';

crownFirmListJsonStub.withArgs(artefactId).resolves(unprocessedData);
crownFirmListJsonStub.withArgs(artefactId, undefined).resolves(undefined);
crownFirmListJsonStub.withArgs('').resolves([]);
crownFirmListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

crownFirmListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownFirmListMetaDataStub.withArgs('').resolves([]);

const listType = 'crown-firm-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
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
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            startDate: '12 April 2023',
            endDate: '15 April 2023',
            allocated: listData,
            contentDate: '14 February 2022',
            publishedDate: '03 March 2023',
            publishedTime: '2:07pm',
            provenance: 'prov1',
            version: '3.4',
            courtName: 'Altrincham County Court and Family Court',
            venueAddress: '26 Diego Gardens\nAddress Line 2\nTown\nLancashire\nAA1 AA1',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

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
        request.query = { artefactId: artefactId };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownFirmListController.get(request, response);
        return responseMock.verify();
    });
});
