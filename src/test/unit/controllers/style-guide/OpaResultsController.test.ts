import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/publicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { DateTime } from 'luxon';
import { HttpStatusCode } from 'axios';
import OpaResultsController from '../../../../main/controllers/style-guide/OpaResultsController';
import { LocationService } from '../../../../main/service/locationService';
import { OpaResultsService } from '../../../../main/service/list-manipulation/OpaResultsService';

const artefactId = 'abc';
const welshArtefactId = 'def';
const notFoundArtefactId = 'ghi';
const listUrl = 'opa-results';

const opaResultsController = new OpaResultsController();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/opaResults.json'), 'utf-8');
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
const welshMetadata = JSON.parse(rawMetadata)[2];

const contentDate = DateTime.fromISO(metadata['contentDate'], { zone: 'utc' }).toFormat('dd MMMM yyyy');
const data1 = { caseUrn: '1', defendant: 'name1', decisionDate: 'date1' };
const data2 = { caseUrn: '2', defendant: 'name2', decisionDate: 'date2' };

const listData = new Map<string, object[]>();
listData.set('date1', [data1]);
listData.set('date2', [data2]);

const jasonDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const metadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: 'Court name',
    welshName: 'Welsh court name',
});

sinon.stub(OpaResultsService.prototype, 'manipulateData').returns(listData);

jasonDataStub.withArgs(artefactId).resolves(JSON.parse(rawData));
jasonDataStub.withArgs(welshArtefactId).resolves(JSON.parse(rawData));
jasonDataStub.withArgs('').resolves([]);
jasonDataStub.withArgs(notFoundArtefactId).resolves(HttpStatusCode.NotFound);

metadataStub.withArgs(artefactId).resolves(metadata);
metadataStub.withArgs(welshArtefactId).resolves(welshMetadata);
metadataStub.withArgs('').resolves([]);

describe('OPA Results controller', () => {
    const i18n = {
        listUrl: {},
        'list-template': {},
    };

    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);

    it('should render the OPA results page with English court', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };
        request.lng = 'en';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listUrl],
            ...i18n['list-template'],
            listData: listData,
            contentDate: contentDate,
            publishedDate: '09 January 2024',
            publishedTime: '11:30pm',
            courtName: 'Court name',
            venueAddress: 'Address Line 1\nAddress Line 2\nTown\nCounty\nAA1 1AA',
        };

        responseMock.expects('render').once().withArgs(listUrl, expectedData);

        await opaResultsController.get(request, response);
        return responseMock.verify();
    });

    it('should render the OPA results page with Welsh court', async () => {
        request.query = { artefactId: welshArtefactId };
        request.user = { userId: '1' };
        request.lng = 'cy';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listUrl],
            ...i18n['list-template'],
            listData: listData,
            contentDate: '14 Chwefror 2022',
            publishedDate: '09 Ionawr 2024',
            publishedTime: '11:30pm',
            courtName: 'Welsh court name',
            venueAddress: 'Address Line 1\nAddress Line 2\nTown\nCounty\nAA1 1AA',
        };

        responseMock.expects('render').once().withArgs(listUrl, expectedData);

        await opaResultsController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page is query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await opaResultsController.get(request, response);
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

        await opaResultsController.get(request, response);
        return responseMock.verify();
    });
});
