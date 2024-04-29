import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import { PublicationService } from '../../../../main/service/PublicationService';
import { mockRequest } from '../../mocks/mockRequest';
import { HttpStatusCode } from 'axios';
import OpaPublicListController from '../../../../main/controllers/style-guide/OpaPublicListController';
import { LocationService } from '../../../../main/service/LocationService';
import { OpaPublicListService } from '../../../../main/service/listManipulation/OpaPublicListService';
import { OpaPressListService } from '../../../../main/service/listManipulation/OpaPressListService';

const opaPublicListController = new OpaPublicListController();

const artefactId = 'abc';
const welshArtefactId = 'def';

const rawData = fs.readFileSync(path.resolve(__dirname, '../../mocks/opaPublicList.json'), 'utf-8');
const listData = JSON.parse(rawData);
const rawMetaData = fs.readFileSync(path.resolve(__dirname, '../../mocks/returnedArtefacts.json'), 'utf-8');
const metaData = JSON.parse(rawMetaData)[0];
const welshMetadata = JSON.parse(rawMetaData)[2];

const opaPublicListJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const opaPublicListMetaDataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');
sinon.stub(LocationService.prototype, 'getLocationById').resolves({
    name: 'Court name',
    welshName: 'Welsh court name',
});
sinon.stub(OpaPublicListService.prototype, 'formatOpaPublicList').returns(listData);
sinon.stub(OpaPressListService.prototype, 'manipulateData').returns(listData);

opaPublicListJsonStub.withArgs(artefactId).resolves(listData);
opaPublicListJsonStub.withArgs(welshArtefactId).resolves(listData);
opaPublicListJsonStub.withArgs(artefactId, undefined).resolves(null);
opaPublicListJsonStub.withArgs('').resolves([]);
opaPublicListJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);

opaPublicListMetaDataStub.withArgs(artefactId).resolves(metaData);
opaPublicListMetaDataStub.withArgs(welshArtefactId).resolves(welshMetadata);
opaPublicListMetaDataStub.withArgs('').resolves([]);

const listType = 'opa-public-list';
const listPath = `style-guide/${listType}`;
const i18n = {
    'style-guide': {
        listType: { value: '123' },
    },
    'list-template': {},
};

describe('OPA Public List Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.path = '/opa-public-list';

    it('should render the opa public list page', async () => {
        request.query = { artefactId: artefactId };
        request.user = { userId: '1' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData: listData,
            length: listData.length,
            publishedDate: '13 February 2022',
            publishedTime: '9:30am',
            provenance: 'prov1',
            courtName: 'Court name',
            venueAddress: 'THE LAW COURTS\ntown name',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await opaPublicListController.get(request, response);
        return responseMock.verify();
    });

    it('should render the opa public list page with Welsh court', async () => {
        request.query = { artefactId: welshArtefactId };
        request.user = { userId: '1' };
        request.lng = 'cy';

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['style-guide'][listType],
            ...i18n['list-template'],
            listData: listData,
            length: listData.length,
            publishedDate: '13 Chwefror 2022',
            publishedTime: '9:30am',
            provenance: 'prov1',
            courtName: 'Welsh court name',
            venueAddress: 'THE LAW COURTS\ntown name',
        };

        responseMock.expects('render').once().withArgs(listPath, expectedData);

        await opaPublicListController.get(request, response);
        return responseMock.verify();
    });

    it('should render error page if query param is empty', async () => {
        request.query = {};
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await opaPublicListController.get(request, response);
        return responseMock.verify();
    });

    it('should render list not found page if response is 404', async () => {
        request.query = { artefactId: '1234' };
        request.user = { userId: '1' };
        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await opaPublicListController.get(request, response);
        return responseMock.verify();
    });
});
