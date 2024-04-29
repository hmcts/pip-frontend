import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { LocationService } from '../../../../main/service/LocationService';
import { ListParseHelperService } from '../../../../main/service/ListParseHelperService';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import CopDailyCauseListController from '../../../../main/controllers/style-guide/CopDailyCauseListController';
import { CopDailyListService } from '../../../../main/service/listManipulation/CopDailyListService';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/copDailyCauseList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const copDailyCauseListController = new CopDailyCauseListController();

const copDailyCauseListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const copDailyCauseListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CopDailyListService.prototype, 'manipulateCopDailyCauseList').returns(listData);
sinon.stub(ListParseHelperService.prototype, 'getRegionalJohFromLocationDetails').returns('Test JoH');

const artefactId = 'abc';

copDailyCauseListJsonStub.withArgs(artefactId).resolves(listData);
copDailyCauseListJsonStub.withArgs('').resolves([]);

copDailyCauseListMetaDataStub.withArgs(artefactId).resolves(metaData);
copDailyCauseListMetaDataStub.withArgs('').resolves([]);

const listType = 'cop-daily-cause-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
    'list-template': { testListTemplate: 'test' },
    'open-justice-statement': { testStatement: 'test' },
};

describe('Cop Daily Cause List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/cop-daily-cause-list';

    it('should render the cop daily cause list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            ...i18n['open-justice-statement'],
            listData,
            contentDate: DateTime.fromISO(metaData['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            publishedDate: '13 February 2022',
            publishedTime: '9:30am',
            courtName: "Abergavenny Magistrates' Court",
            regionalJoh: 'Test JoH',
            provenance: 'prov1',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await copDailyCauseListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        const request = mockRequest(i18n);
        request.query = {};
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await copDailyCauseListController.get(request, response);
        return responseMock.verify();
    });
});
