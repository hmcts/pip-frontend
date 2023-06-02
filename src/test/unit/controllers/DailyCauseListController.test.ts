import sinon from 'sinon';
import { Response } from 'express';
import DailyCauseListController from '../../../main/controllers/DailyCauseListController';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { LocationService } from '../../../main/service/locationService';
import { CivilFamilyAndMixedListService } from '../../../main/service/listManipulation/CivilFamilyAndMixedListService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/familyDailyCauseList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');

const metaDataFamily = JSON.parse(rawMetaData)[0];
metaDataFamily.listType = 'FAMILY_DAILY_CAUSE_LIST';

const metaDataCivil = JSON.parse(rawMetaData)[0];
metaDataCivil.listType = 'CIVIL_DAILY_CAUSE_LIST';

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const dailyCauseListController = new DailyCauseListController();

const dailyCauseListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const dailyCauseListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedCivilListData').returns(listData);
sinon.stub(CivilFamilyAndMixedListService.prototype, 'sculptedFamilyMixedListData').returns(listData);

const artefactIdFamily = 'abc';
const artefactIdCivil = 'def';

dailyCauseListJsonStub.withArgs(artefactIdFamily).resolves(listData);
dailyCauseListJsonStub.withArgs(artefactIdCivil).resolves(listData);
dailyCauseListJsonStub.withArgs('').resolves([]);
dailyCauseListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

dailyCauseListMetaDataStub.withArgs(artefactIdFamily).resolves(metaDataFamily);
dailyCauseListMetaDataStub.withArgs(artefactIdCivil).resolves(metaDataCivil);
dailyCauseListMetaDataStub.withArgs('').resolves([]);

const i18n = {
    'daily-cause-list': {},
    'family-daily-cause-list': {},
    'list-template': { testListTemplate: 'test' },
    'open-justice-statement': { testStatement: 'test' },
};

describe('Daily Cause List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render the family daily cause list page', async () => {
        request.path = '/family-daily-cause-list';
        request.query = { artefactId: artefactIdFamily };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['family-daily-cause-list'],
            ...i18n['list-template'],
            ...i18n['open-justice-statement'],
            listData,
            contentDate: DateTime.fromISO(metaDataFamily['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '14 September 2020',
            publishedTime: '12:30am',
            provenance: 'prov1',
            courtName: "Abergavenny Magistrates' Court",
            bill: false,
        };

        responseMock.expects('render').once().withArgs('family-daily-cause-list', expectedData);

        await dailyCauseListController.get(request, response);
        return responseMock.verify();
    });

    it('should render the civil daily cause list page', async () => {
        request.path = '/daily-cause-list';
        request.query = { artefactId: artefactIdCivil };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['daily-cause-list'],
            ...i18n['list-template'],
            ...i18n['open-justice-statement'],
            listData,
            contentDate: DateTime.fromISO(metaDataCivil['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '14 September 2020',
            publishedTime: '12:30am',
            provenance: 'prov1',
            courtName: "Abergavenny Magistrates' Court",
            bill: false,
        };

        responseMock.expects('render').once().withArgs('daily-cause-list', expectedData);

        await dailyCauseListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.path = '/family-daily-cause-list';
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await dailyCauseListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.path = '/family-daily-cause-list';
        request.query = { artefactId: '1234' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await dailyCauseListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        sinon.restore();
        request.path = '/family-daily-cause-list';
        request.query = { artefactId: artefactIdFamily };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await dailyCauseListController.get(request, response);
        return responseMock.verify();
    });
});
