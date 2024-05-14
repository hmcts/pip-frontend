import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../../main/service/LocationService';
import MagistratesStandardListController from '../../../../main/controllers/style-guide/MagistratesStandardListController';
import { MagistratesStandardListService } from '../../../../main/service/listManipulation/MagistratesStandardListService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesStandardList.json'), 'utf-8');

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'MAGISTRATES_STANDARD_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const magsStandardListController = new MagistratesStandardListController();

const magsStandardListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsStandardListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

const data1 = { defendantHeading: 'heading1', caseNumber: 'case1' };
const data2 = { defendantHeading: 'heading2', caseNumber: 'case2' };

const listData = new Map<string, object[]>();
listData.set('courtRoom1', [data1]);
listData.set('courtRoom2', [data2]);
sinon.stub(MagistratesStandardListService.prototype, 'manipulateData').returns(listData);

const artefactId = 'abc';
const artefactIdListNotFound = 'xyz';

magsStandardListJsonStub.withArgs(artefactId).resolves(JSON.parse(rawData));
magsStandardListJsonStub.withArgs(artefactId, undefined).resolves(undefined);
magsStandardListJsonStub.withArgs('').resolves([]);
magsStandardListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

magsStandardListMetaDataStub.withArgs(artefactId).resolves(metaData);
magsStandardListMetaDataStub.withArgs('').resolves([]);
magsStandardListMetaDataStub.withArgs(artefactIdListNotFound).resolves(metaDataListNotFound);

const listType = 'magistrates-standard-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
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
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData,
            contentDate: DateTime.fromISO(metaData['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '01 December 2023',
            courtName: "Abergavenny Magistrates' Court",
            publishedTime: '11:30pm',
            provenance: 'prov1',
            version: '1.0',
            venueAddress: 'Address Line 1\nAddress Line 2\nTown\nLancashire\nAA1 AA1',
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
        request.query = { artefactId: artefactId };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magsStandardListController.get(request, response);
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

        await magsStandardListController.get(request, response);
        return responseMock.verify();
    });
});
