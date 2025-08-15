import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../../main/service/LocationService';
import { MagistratesAdultCourtListService } from '../../../../main/service/listManipulation/MagistratesAdultCourtListService';
import { HttpStatusCode } from 'axios';
import { describe } from '@jest/globals';
import MagistratesAdultCourtListController
    from '../../../../main/controllers/style-guide/MagistratesAdultCourtListController';

const urlDailyList = '/magistrates-adult-court-list-daily';
const urlFutureList = '/magistrates-adult-court-list-future';
const artefactIdDailyList = 'abc';
const artefactIdFutureList = 'def';
const artefactIdListNotFound = 'xyz';

const artefactIdMap = new Map<string, string>([
    [urlDailyList, artefactIdDailyList],
    [urlFutureList, artefactIdFutureList],
]);

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesAdultCourtList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyList = JSON.parse(rawMetadata)[0];
metadataDailyList.listType = 'MAGISTRATES_ADULT_COURT_LIST_DAILY';
const metadataFutureList = JSON.parse(rawMetadata)[0];
metadataFutureList.listType = 'MAGISTRATES_ADULT_COURT_LIST_FUTURE';
const metadataListNotFound = JSON.parse(rawMetadata)[0];

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

const magsAdultCourtListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsAdultCourtListMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(MagistratesAdultCourtListService.prototype, 'processPayload').returns(listData);

magsAdultCourtListJsonStub.withArgs(artefactIdDailyList).resolves(listData);
magsAdultCourtListJsonStub.withArgs(artefactIdDailyList, undefined).resolves(undefined);
magsAdultCourtListJsonStub.withArgs(artefactIdFutureList).resolves(listData);
magsAdultCourtListJsonStub.withArgs(artefactIdFutureList, undefined).resolves(undefined);
magsAdultCourtListJsonStub.withArgs('').resolves([]);
magsAdultCourtListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

magsAdultCourtListMetadataStub.withArgs(artefactIdDailyList).resolves(metadataDailyList);
magsAdultCourtListMetadataStub.withArgs(artefactIdFutureList).resolves(metadataFutureList);
magsAdultCourtListMetadataStub.withArgs('').resolves([]);
magsAdultCourtListMetadataStub.withArgs(artefactIdListNotFound).resolves(metadataListNotFound);

const i18n = {
    listType: { value: '123' },
    'list-template': {},
};

const magistratesAdultCourtListController = new MagistratesAdultCourtListController();

describe.each([urlDailyList, urlFutureList])("Magistrates Adult Court List Controller with path '%s'", url => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const request = mockRequest(i18n);
    const listPath = 'style-guide/magistrates-adult-court-list';
    request.path = url;

    it('should render the Magistrates Adult Court List page', async () => {
        request.query = { artefactId: artefactIdMap.get(url) };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['magistrates-adult-court-list'],
            ...i18n['list-template'],
            listData,
            contentDate: DateTime.fromISO(metadataDailyList['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            locationName: "Abergavenny Magistrates' Court",
            provenance: 'prov1',
            publishedDate: '31 July 2025',
            publishedTime: '9:05am',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await magistratesAdultCourtListController.get(request, response, url.substring(1));
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesAdultCourtListController.get(request, response, url.substring(1));
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

        await magistratesAdultCourtListController.get(request, response, url.substring(1));
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        request.query = { artefactId: artefactIdMap.get(url) };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesAdultCourtListController.get(request, response, url.substring(1));
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

        await magistratesAdultCourtListController.get(request, response, url.substring(1));
        return responseMock.verify();
    });
});
