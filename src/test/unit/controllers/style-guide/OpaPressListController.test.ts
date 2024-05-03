import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { HttpStatusCode } from 'axios';
import OpaPressListController from '../../../../main/controllers/style-guide/OpaPressListController';
import { LocationService } from '../../../../main/service/LocationService';
import { OpaPressListService } from '../../../../main/service/listManipulation/OpaPressListService';

const artefactId = 'abc';
const welshArtefactId = 'def';
const notFoundArtefactId = 'ghi';
const listType = 'opa-press-list';
const listPath = `style-guide/${listType}`;

const opaPressListController = new OpaPressListController();

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaPressList.json'), 'utf-8');
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
metadata.listType = 'OPA_PRESS_LIST';
const welshMetadata = JSON.parse(rawMetadata)[2];
welshMetadata.listType = 'OPA_PRESS_LIST';
const metaDataListNotFound = JSON.parse(metadata)[0];

const contentDate = DateTime.fromISO(metadata['contentDate'], { zone: 'utc' }).toFormat('dd MMMM yyyy');
const data1 = { urn: '1', name: 'name1', pleaDate: 'date1' };
const data2 = { urn: '2', name: 'name2', pleaDate: 'date2' };

const listData = new Map<string, object[]>();
listData.set('date1', [data1]);
listData.set('date2', [data2]);

const jasonDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: 'Court name',
    welshName: 'Welsh court name',
});

sinon.stub(OpaPressListService.prototype, 'manipulateData').returns(listData);

jasonDataStub.withArgs(artefactId).resolves(JSON.parse(rawData));
jasonDataStub.withArgs(welshArtefactId).resolves(JSON.parse(rawData));
jasonDataStub.withArgs('').resolves([]);
jasonDataStub.withArgs(notFoundArtefactId).resolves(HttpStatusCode.NotFound);

metadataStub.withArgs(artefactId).resolves(metadata);
metadataStub.withArgs(welshArtefactId).resolves(welshMetadata);
metadataStub.withArgs('').resolves([]);
metadataStub.withArgs(notFoundArtefactId).resolves(metaDataListNotFound);

describe('OPA Press List Controller', () => {
    const i18n = {
        'style-guide': {
            listType: { value: '123' },
        },
        'list-template': {},
    };

    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render the OPA press list page with English court', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };
        request.lng = 'en';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData: listData,
            contentDate: contentDate,
            publishedDate: '14 September 2023',
            publishedTime: '12:30am',
            version: '1.0',
            courtName: 'Court name',
            venueAddress: 'Address Line 1\nAddress Line 2\nTown\nCounty\nAA1 1AA',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });

    it('should render the OPA press list page with Welsh court', async () => {
        request.query = { artefactId: welshArtefactId };
        request.user = { userId: '1' };
        request.lng = 'cy';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData: listData,
            contentDate: '14 Chwefror 2022',
            publishedDate: '14 Medi 2023',
            publishedTime: '12:30am',
            version: '1.0',
            courtName: 'Welsh court name',
            venueAddress: 'Address Line 1\nAddress Line 2\nTown\nCounty\nAA1 1AA',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.query = { artefactId: notFoundArtefactId };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if list type not valid', async () => {
        request.query = { artefactId: notFoundArtefactId };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });
});
