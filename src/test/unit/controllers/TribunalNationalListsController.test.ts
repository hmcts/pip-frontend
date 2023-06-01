import sinon from 'sinon';
import fs from 'fs';
import path from 'path';
import TribunalNationalListsController from '../../../main/controllers/TribunalNationalListsController';
import { PublicationService } from '../../../main/service/publicationService';
import { LocationService } from '../../../main/service/locationService';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { TribunalNationalListsService } from '../../../main/service/listManipulation/TribunalNationalListsService';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/primaryHealthList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const tribunalNationalListsController = new TribunalNationalListsController();

const tribunalNationalListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const tribunalNationalListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(TribunalNationalListsService.prototype, 'manipulateData').returns(listData);

const artefactId = 'abc';

tribunalNationalListJsonStub.withArgs(artefactId).resolves(listData);
tribunalNationalListJsonStub.withArgs('').resolves([]);
tribunalNationalListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

tribunalNationalListMetaDataStub.withArgs(artefactId).resolves(metaData);
tribunalNationalListMetaDataStub.withArgs('').resolves([]);

const i18n = {
    'care-standards-list': {},
    'primary-health-list': {},
    'list-template': { testListTemplate: 'test' },
    'open-justice-statement': { testStatement: 'test' },
};

describe('Tribunal National List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const expectedData = {
        ...i18n['open-justice-statement'],
        ...i18n['list-template'],
        contentDate: DateTime.fromISO(metaData['contentDate'], {
            zone: 'utc',
        }).toFormat('dd MMMM yyyy'),
        listData,
        publishedDate: '04 October 2022',
        publishedTime: '10am',
        provenance: 'prov1',
        courtName: "Abergavenny Magistrates' Court",
        venueEmail: 'court1@moj.gov.uk',
        venueTelephone: '01772 844700',
        bill: false,
    };

    it('should render the primary health list page', async () => {
        const request = mockRequest(i18n);
        request.path = '/primary-health-list';
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedPrimaryHealthListData = {
            ...i18n['primary-health-list'],
            ...expectedData,
        };

        responseMock.expects('render').once().withArgs('primary-health-list', expectedPrimaryHealthListData);

        await tribunalNationalListsController.get(request, response);
        return responseMock.verify();
    });

    it('should render the care standards list page', async () => {
        const request = mockRequest(i18n);
        request.path = '/care-standards-list';
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);
        const expectedCareStandardsListData = {
            ...i18n['care-standards-list'],
            ...expectedData,
        };

        responseMock.expects('render').once().withArgs('care-standards-list', expectedCareStandardsListData);

        await tribunalNationalListsController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        const request = mockRequest(i18n);
        request.query = {};
        request.user = { userId: '123' };
        request.path = '/primary-health-list';

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await tribunalNationalListsController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        const request = mockRequest(i18n);
        request.query = { artefactId: '1234' };
        request.user = { userId: '123' };
        request.path = '/primary-health-list';

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await tribunalNationalListsController.get(request, response);
        return responseMock.verify();
    });
});
