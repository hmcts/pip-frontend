import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../main/service/locationService';
import MagistratesStandardListController from '../../../main/controllers/MagistratesStandardListController';
import { MagistratesStandardListService } from '../../../main/service/listManipulation/MagistratesStandardListService';
import { CivilFamilyAndMixedListService } from '../../../main/service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/magsStandardList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const magsStandardListController = new MagistratesStandardListController();

const magsStandardListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsStandardListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').returns(listData);
sinon.stub(MagistratesStandardListService.prototype, 'manipulatedMagsStandardListData').returns(listData);

const artefactId = 'abc';

magsStandardListJsonStub.withArgs(artefactId).resolves(listData);
magsStandardListJsonStub.withArgs('').resolves([]);
magsStandardListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

magsStandardListMetaDataStub.withArgs(artefactId).resolves(metaData);
magsStandardListMetaDataStub.withArgs('').resolves([]);

const listPath = 'magistrates-standard-list';
const i18n = {
    listPath: {},
    'list-template': {},
};

describe('Magistrate Standard List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/' + listPath;

    it('should render the magistrate standard list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listPath],
            ...i18n['list-template'],
            listData,
            contentDate: DateTime.fromISO(metaData['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '14 September 2016',
            courtName: "Abergavenny Magistrates' Court",
            publishedTime: '12:30am',
            provenance: 'prov1',
            version: '1.0',
            bill: false,
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await magsStandardListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magsStandardListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.user = { userId: '1' };
        request.query = { artefactId: '1234' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await magsStandardListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        sinon.restore();
        request.query = { artefactId: artefactId };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magsStandardListController.get(request, response);
        return responseMock.verify();
    });
});
