import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { CrownWarnedPddaListService } from '../../../../main/service/listManipulation/CrownWarnedPddaListService';
import CrownWarnedPddaListController from '../../../../main/controllers/style-guide/CrownWarnedPddaListController';
import { HttpStatusCode } from 'axios';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/crownWarnedPddaList.json'), 'utf-8');
const rawDataObj = JSON.parse(rawData);

const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
metaData.listType = 'CROWN_WARNED_PDDA_LIST';
const metaDataListNotFound = JSON.parse(rawMetaData)[1];

const crownWarnedPddaListController = new CrownWarnedPddaListController();

const crownWarnedPddaListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const crownWarnedPddaListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

const artefactId = 'abc';
const artefactIdListNotFound = 'xyz';
const artefactIdListInvalidListType = 'lmn';

const allocatedData = {
    caseReference: '1',
    defendant: '2',
    hearingDate: '3',
    defendantRepresentative: '4',
    prosecutingAuthority: '5',
    linkedCases: '6',
    listingNotes: '7',
};

const toBeAllocatedData = {
    caseReference: '9',
    defendant: '9',
    hearingDate: '9',
    defendantRepresentative: '9',
    prosecutingAuthority: '9',
    linkedCases: '9',
    listingNotes: '9',
};

const listData = new Map<string, object[]>();
listData.set('Hearing type', [allocatedData]);
listData.set('To be allocated', [toBeAllocatedData]);
sinon.stub(CrownWarnedPddaListService.prototype, 'processPayload').returns(listData);

const listDataWithAllocatedData = new Map<string, object[]>();
listDataWithAllocatedData.set('Hearing type', [allocatedData]);

crownWarnedPddaListJsonStub.withArgs(artefactId).resolves(rawDataObj);
crownWarnedPddaListJsonStub.withArgs('').resolves([]);
crownWarnedPddaListJsonStub.withArgs(artefactIdListNotFound).resolves(HttpStatusCode.NotFound);

crownWarnedPddaListMetaDataStub.withArgs(artefactId).resolves(metaData);
crownWarnedPddaListMetaDataStub.withArgs('').resolves([]);
crownWarnedPddaListMetaDataStub.withArgs(artefactIdListInvalidListType).resolves(metaDataListNotFound);

const listType = 'crown-warned-pdda-list';
const i18n = {
    listType: { value: '123' },
    'list-template': {},
};

describe('Crown Warned PDDA List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    const request = mockRequest(i18n);
    const listPath = 'style-guide/' + listType;

    it('should render the crown warned pdda list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listType],
            ...i18n['list-template'],
            listData: listData,
            locationName: rawDataObj['venue'],
            contentDate: '14 February 2022',
            provenance: 'prov1',
            publishedDate: '01 January 2024',
            publishedTime: '10am',
            startDate: '01 January 2024',
            endDate: '02 January 2024',
            version: 'TestVersion',
            venueAddress: ['TestAddressLine1', 'TestAddressLine2', 'TestPostcode'],
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await crownWarnedPddaListController.get(request, response);
        responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await crownWarnedPddaListController.get(request, response);
        responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.query = { artefactId: artefactIdListNotFound };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await crownWarnedPddaListController.get(request, response);
        responseMock.verify();
    });

    it('should render list not found page if list type not valid', async () => {
        request.query = { artefactId: artefactIdListInvalidListType };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await crownWarnedPddaListController.get(request, response);
        responseMock.verify();
    });
});
