import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { LocationService } from '../../../../main/service/LocationService';
import { describe } from '@jest/globals';
import { CrownPddaListService } from '../../../../main/service/listManipulation/CrownPddaListService';
import CrownPddaListController from '../../../../main/controllers/style-guide/CrownPddaListController';
import { HttpStatusCode } from 'axios';

const urlDailyList = 'crown-daily-pdda-list';
const urlFirmList = 'crown-firm-pdda-list';

const artefactIdDailyList = 'abc';
const artefactIdFirmList = 'def';
const artefactIdListNotFound = 'ghi';
const artefactIdListInvalidListType = 'jkl';

const artefactIdMap = new Map<string, string>([
    [urlDailyList, artefactIdDailyList],
    [urlFirmList, artefactIdFirmList],
]);

const rawDailyListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownDailyPddaList.json'), 'utf-8');
const dailyListData = JSON.parse(rawDailyListData);
const rawFirmListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownFirmPddaList.json'), 'utf-8');
const firmListData = JSON.parse(rawFirmListData);

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metadataDailyList = JSON.parse(rawMetadata)[0];
metadataDailyList.listType = 'CROWN_DAILY_PDDA_LIST';
const metadataFirmList = JSON.parse(rawMetadata)[0];
metadataFirmList.listType = 'CROWN_FIRM_PDDA_LIST';
const metadataListNotFound = JSON.parse(rawMetadata)[0];

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);

const processPayloadStub = sinon.stub(CrownPddaListService.prototype, 'processPayload');
processPayloadStub.withArgs(sinon.match.any, sinon.match.any, 'crown-daily-pdda-list').returns(dailyListData);
processPayloadStub.withArgs(sinon.match.any, sinon.match.any, 'crown-firm-pdda-list').returns(firmListData);

const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

jsonStub.withArgs(artefactIdDailyList).resolves(dailyListData);
jsonStub.withArgs(artefactIdFirmList).resolves(firmListData);
jsonStub.withArgs(artefactIdDailyList, undefined).resolves(undefined);
jsonStub.withArgs(artefactIdFirmList, undefined).resolves(undefined);
jsonStub.withArgs(artefactIdListNotFound).resolves(HttpStatusCode.NotFound);

metadataStub.withArgs(artefactIdDailyList).resolves(metadataDailyList);
metadataStub.withArgs(artefactIdFirmList).resolves(metadataFirmList);
metadataStub.withArgs(artefactIdListInvalidListType).resolves(metadataListNotFound);

const i18n = {
    listType: { value: '123' },
    'list-template': {},
    'crown-daily-pdda-list': {
        title: 'Crown Daily List',
    },
    'crown-firm-pdda-list': {
        title: 'Crown Firm List',
    },
};

const crownPddaListController = new CrownPddaListController();

describe.each([urlDailyList, urlFirmList])("Crown PDDA List Controller with path '%s'", url => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const request = mockRequest(i18n);
    const listPath = 'style-guide/' + url;

    it('should render the Crown PDDA List page', async () => {
        request.query = { artefactId: artefactIdMap.get(url) };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[url],
            ...i18n['list-template'],
            listData: url.includes('daily') ? dailyListData : firmListData,
            locationName: "Abergavenny Magistrates' Court",
            provenance: 'prov1',
            publishedDate: '09 September 2025',
            publishedTime: '11am',
            startDate: '10 September 2025',
            endDate: '11 September 2025',
            version: '1.0',
            venueAddress: ['1 Main Road', 'London', 'A1 1AA'],
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await crownPddaListController.get(request, response, url);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownPddaListController.get(request, response, url);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.user = { userId: '1' };
        request.query = { artefactId: artefactIdListNotFound };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await crownPddaListController.get(request, response, url);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        request.query = { artefactId: artefactIdMap.get(url) };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownPddaListController.get(request, response, url);
        return responseMock.verify();
    });

    it('should render list not found page if list type not valid', async () => {
        request.query = { artefactId: artefactIdListInvalidListType };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await crownPddaListController.get(request, response, url);
        return responseMock.verify();
    });
});
