import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { LocationService } from '../../../../main/service/LocationService';
import { describe } from '@jest/globals';
import { CrownFirmPddaListService } from '../../../../main/service/listManipulation/CrownFirmPddaListService';
import CrownFirmPddaListController from '../../../../main/controllers/style-guide/CrownFirmPddaListController';
import { HttpStatusCode } from 'axios';

const url = '/crown-firm-pdda-list';
const artefactId = 'abc';
const artefactIdListNotFound = 'def';
const artefactIdListInvalidListType = 'ghi';

const rawListData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownFirmPddaList.json'), 'utf-8');
const listData = JSON.parse(rawListData);

const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
metadata.listType = 'CROWN_FIRM_PDDA_LIST';
const metadataListNotFound = JSON.parse(rawMetadata)[0];

const rawCourtData = fs.readFileSync(path.resolve(__dirname, '../../mocks/courtAndHearings.json'), 'utf-8');
const courtData = JSON.parse(rawCourtData);

sinon.stub(LocationService.prototype, 'getLocationById').resolves(courtData[0]);
sinon.stub(CrownFirmPddaListService.prototype, 'processPayload').returns(listData);

const jsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

jsonStub.withArgs(artefactId).resolves(listData);
jsonStub.withArgs(artefactId, undefined).resolves(undefined);
jsonStub.withArgs(artefactIdListNotFound).resolves(HttpStatusCode.NotFound);

metadataStub.withArgs(artefactId).resolves(metadata);
metadataStub.withArgs(artefactIdListInvalidListType).resolves(metadataListNotFound);

const i18n = {
    listType: { value: '123' },
    'list-template': {},
    'crown-firm-pdda-list': {
        title: 'Crown Firm List',
    },
};

const crownFirmPddaListController = new CrownFirmPddaListController();

describe('Crown Firm PDDA List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const request = mockRequest(i18n);
    const listPath = 'style-guide/crown-firm-pdda-list';

    request.path = url;

    it('should render the Crown Firm PDDA List page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['crown-firm-pdda-list'],
            ...i18n['list-template'],
            listData: listData,
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

        await crownFirmPddaListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownFirmPddaListController.get(request, response);
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

        await crownFirmPddaListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if list is not allowed to view by the user', async () => {
        request.query = { artefactId: artefactId };
        request.user = {};
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownFirmPddaListController.get(request, response);
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

        await crownFirmPddaListController.get(request, response);
        return responseMock.verify();
    });
});
