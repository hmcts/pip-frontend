import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../main/service/locationService';
import { CrimeListsService } from '../../../main/service/listManipulation/CrimeListsService';
import MagistratesPublicListController from '../../../main/controllers/MagistratesPublicListController';
import { CivilFamilyAndMixedListService } from '../../../main/service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/magistratesPublicList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const magistratesPublicListController = new MagistratesPublicListController();

const magistratesPublicListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magistratesPublicListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').returns(listData);
sinon.stub(CrimeListsService.prototype, 'manipulateCrimeListData').returns(listData);

const artefactId = 'abc';

magistratesPublicListJsonStub.withArgs(artefactId).resolves(listData);
magistratesPublicListJsonStub.withArgs('').resolves([]);
magistratesPublicListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

magistratesPublicListMetaDataStub.withArgs(artefactId).resolves(metaData);
magistratesPublicListMetaDataStub.withArgs('').resolves([]);

const i18n = {
    'magistrates-public-list': {},
    'list-template': {},
};

describe('Magistrates Public List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/magistrates-public-list';

    it('should render the magistrates public list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['magistrates-public-list'],
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
            bill: false,
        };

        responseMock.expects('render').once().withArgs('magistrates-public-list', expectedData);

        await magistratesPublicListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesPublicListController.get(request, response);
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

        await magistratesPublicListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        sinon.restore();
        request.query = { artefactId: artefactId };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesPublicListController.get(request, response);
        return responseMock.verify();
    });
});
