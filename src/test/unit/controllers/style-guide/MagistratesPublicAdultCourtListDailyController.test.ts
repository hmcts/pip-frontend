import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../../main/service/LocationService';
import { HttpStatusCode } from 'axios';
import { describe } from '@jest/globals';
import MagistratesPublicAdultCourtListDailyController
    from '../../../../main/controllers/style-guide/MagistratesPublicAdultCourtListDailyController';
import {
    MagistratesPublicAdultCourtListDailyService
} from '../../../../main/service/listManipulation/MagistratesPublicAdultCourtListDailyService';

const artefactIdDailyList = 'abc';
const artefactIdListNotFound = 'xyz';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/magistratesPublicAdultCourtListDaily.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');

const metadataDailyList = JSON.parse(rawMetadata)[0];
metadataDailyList.listType = 'MAGISTRATES_PUBLIC_ADULT_COURT_LIST_DAILY';
const metadataListNotFound = JSON.parse(rawMetadata)[0];

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

const magsPublicAdultCourtListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const magsPublicAdultCourtListMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(MagistratesPublicAdultCourtListDailyService.prototype, 'processPayload').returns(listData)

magsPublicAdultCourtListJsonStub.withArgs(artefactIdDailyList).resolves(listData);
magsPublicAdultCourtListJsonStub.withArgs(artefactIdDailyList, undefined).resolves(undefined);
magsPublicAdultCourtListJsonStub.withArgs('').resolves([]);
magsPublicAdultCourtListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

magsPublicAdultCourtListMetadataStub.withArgs(artefactIdDailyList).resolves(metadataDailyList);
magsPublicAdultCourtListMetadataStub.withArgs('').resolves([]);
magsPublicAdultCourtListMetadataStub.withArgs(artefactIdListNotFound).resolves(metadataListNotFound);

const i18n = {
    listType: { value: '123' },
    'list-template': {},
    'magistrates-public-adult-court-list-daily': {},
};

const magistratesPublicAdultCourtListController = new MagistratesPublicAdultCourtListDailyController();

describe("Magistrates Public Adult Court List Daily Controller", () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const request = mockRequest(i18n);
    const listPath = 'style-guide/magistrates-public-adult-court-list-daily';

    it('should render the Magistrates Public Adult Court List Daily page', async () => {
        request.query = { artefactId: artefactIdDailyList };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['magistrates-public-adult-court-list-daily'],
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

        await magistratesPublicAdultCourtListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesPublicAdultCourtListController.get(request, response);
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

        await magistratesPublicAdultCourtListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        request.query = { artefactId: artefactIdDailyList };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await magistratesPublicAdultCourtListController.get(request, response);
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

        await magistratesPublicAdultCourtListController.get(request, response);
        return responseMock.verify();
    });
});
