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

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/primaryHealthList.json'), 'utf-8');
const listData = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];

const rawDataCourt = fs.readFileSync(path.resolve(__dirname, '../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawDataCourt);

const tribunalNationalListsController = new TribunalNationalListsController();

const primaryHealthListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const primaryHealthListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(TribunalNationalListsService.prototype, 'manipulateData').returns(listData);

const artefactId = 'abc';

primaryHealthListJsonStub.withArgs(artefactId).resolves(listData);
primaryHealthListJsonStub.withArgs('').resolves([]);

primaryHealthListMetaDataStub.withArgs(artefactId).resolves(metaData);
primaryHealthListMetaDataStub.withArgs('').resolves([]);

const i18n = {
    'primary-health-list': {},
    'list-template': {},
};

describe('Primary Health List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/primary-health-list';

    afterEach(() => {
        sinon.restore();
    });

    it('should render the primary health list list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);
        const expectedData = {
            ...i18n['list-template'],
            contentDate: DateTime.fromISO(metaData['contentDate'], {
                zone: 'utc',
            }).toFormat('dd MMMM yyyy'),
            listData,
            publishedDate: '04 October 2022',
            publishedTime: '10am',
            provenance: 'prov1',
            bill: false,
            venueEmail: 'court1@moj.gov.uk',
        };

        responseMock.expects('render').once().withArgs('primary-health-list', expectedData);

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
});
