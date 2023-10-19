import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../main/service/publicationService';
import { mockRequest } from '../mocks/mockRequest';
import { DateTime } from 'luxon';
import { HttpStatusCode } from 'axios';
import OpaPressListListController from '../../../main/controllers/OpaPressListController';
import { LocationService } from '../../../main/service/locationService';
import { OpaPressListService } from '../../../main/service/listManipulation/OpaPressListService';

const artefactId = 'abc';
const welshArtefactId = 'def';
const notFoundArtefactId = 'ghi';
const listUrl = 'opa-press-list';

const opaPressListController = new OpaPressListListController();

const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/crownWarnedList.json'), 'utf-8');
const rawMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const rawWelshMetadata = fs.readFileSync(path.resolve(__dirname, '../mocks/returnedArtefacts.json'), 'utf-8');
const metadata = JSON.parse(rawMetadata)[0];
const welshMetadata = JSON.parse(rawWelshMetadata)[0];
welshMetadata.language = 'WELSH';

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

describe('OPA Press List Controller', () => {
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

    it('should render the OPA press list page with English court', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listUrl],
            ...i18n['list-template'],
            listData: listData,
            contentDate: contentDate,
            publishedDate: '13 September 2022',
            publishedTime: '12:30pm',
            version: '1.0',
            courtName: 'Court name',
            venueAddress: 'Princess Square\nManchester\nM1 1AA',
            bill: false,
        };

        responseMock.expects('render').once().withArgs(listUrl, expectedData);

        await opaPressListController.get(request, response);
        return responseMock.verify();
    });

    it('should render the OPA press list page with Welsh court', async () => {
        request.query = { artefactId: welshArtefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n[listUrl],
            ...i18n['list-template'],
            listData: listData,
            contentDate: contentDate,
            publishedDate: '13 September 2022',
            publishedTime: '12:30pm',
            version: '1.0',
            courtName: 'Welsh court name',
            venueAddress: 'Princess Square\nManchester\nM1 1AA',
            bill: true,
        };

        responseMock.expects('render').once().withArgs(listUrl, expectedData);

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
});
