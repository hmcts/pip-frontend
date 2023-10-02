import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import SscsDailyListController from '../../../main/controllers/SscsDailyListController';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { SscsDailyListService } from '../../../main/service/listManipulation/SscsDailyListService';
import { HttpStatusCode } from 'axios';
import { describe } from '@jest/globals';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/sscsDailyList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataSscs = JSON.parse(rawMetaData)[0];
metaDataSscs.listType = 'SSCS_DAILY_LIST';

const metaDataSscsAdditionalHearings = JSON.parse(rawMetaData)[0];
metaDataSscsAdditionalHearings.listType = 'SSCS_DAILY_LIST_ADDITIONAL_HEARINGS';

const contentDate = metaDataSscs['contentDate'];
const userId = '1';
const sscDailyListUrl = '/sscs-daily-list';
const sscDailyListAdditionalHearingsUrl = '/sscs-daily-list-additional-hearings';

const artefactIdMap = new Map<string, string>([
    [sscDailyListUrl, 'abc'],
    [sscDailyListAdditionalHearingsUrl, 'def'],
]);

const sscsDailyListController = new SscsDailyListController();
const sscsDailyListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const sscsDailyListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(SscsDailyListService.prototype, 'manipulateSscsDailyListData').returns(listData);

sscsDailyListJsonStub.withArgs(artefactIdMap.get(sscDailyListUrl), userId).resolves(listData);
sscsDailyListJsonStub.withArgs(artefactIdMap.get(sscDailyListAdditionalHearingsUrl), userId).resolves(listData);
sscsDailyListJsonStub.withArgs('', userId).resolves([]);
sscsDailyListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

sscsDailyListMetaDataStub.withArgs(artefactIdMap.get(sscDailyListUrl), userId).resolves(metaDataSscs);
sscsDailyListMetaDataStub
    .withArgs(artefactIdMap.get(sscDailyListAdditionalHearingsUrl), userId)
    .resolves(metaDataSscsAdditionalHearings);
sscsDailyListMetaDataStub.withArgs('', userId).resolves([]);

const i18n = {
    'sscs-daily-list': { warning: 'warning1' },
    'sscs-daily-list-additional-hearings': { warning: 'warning2' },
    'list-template': { testListTemplate: 'test' },
    'open-justice-statement': { testStatement: 'test' },
};

const response = {
    render: () => {
        return '';
    },
} as unknown as Response;
const request = mockRequest(i18n);

describe.each([sscDailyListUrl, sscDailyListAdditionalHearingsUrl])(
    "Sscs Daily List Controller with path '%s'",
    url => {
        it('should render the sscs daily list page', async () => {
            request.path = url;
            request.query = { artefactId: artefactIdMap.get(url) };
            request.user = { userId: userId };

            const responseMock = sinon.mock(response);
            const expectedData = {
                ...i18n[url.substring(1)],
                ...i18n['list-template'],
                ...i18n['open-justice-statement'],
                listData,
                contentDate: DateTime.fromISO(contentDate, { zone: 'utc' }).toFormat('dd MMMM yyyy'),
                publishedDate: '14 September 2020',
                courtName: "Abergavenny Magistrates' Court",
                publishedTime: '12:30am',
                provenance: 'prov1',
                bill: false,
            };

            responseMock.expects('render').once().withArgs('sscs-daily-list', expectedData);

            await sscsDailyListController.get(request, response);
            return responseMock.verify();
        });
        it('should render error page if query param is empty', async () => {
            request.path = url;
            request.query = {};
            request.user = { userId: userId };

            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            await sscsDailyListController.get(request, response);
            return responseMock.verify();
        });

        it('should render list not found page if response is 404', async () => {
            request.path = url;
            request.query = { artefactId: '1234' };
            request.user = { userId: userId };

            const responseMock = sinon.mock(response);

            responseMock
                .expects('render')
                .once()
                .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

            await sscsDailyListController.get(request, response);
            return responseMock.verify();
        });
    }
);
