import sinon from 'sinon';
import { mockRequest } from '../../mocks/mockRequest';
import { Response } from 'express';
import NonStrategicTribunalListsController from '../../../../main/controllers/style-guide/NonStrategicTribunalListsController';
import { HttpStatusCode } from 'axios';
import { PublicationService } from '../../../../main/service/PublicationService';

const nonStrategicTribunalListsController = new NonStrategicTribunalListsController();

const getPublicationJsonStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationJson');
const getMetadataStub = sinon.stub(PublicationService.prototype, 'getIndividualPublicationMetadata');

const i18n = {
    'list-template': { value: '12345' },
    'cst-and-pht-weekly-hearing-list': { value2: '1234' },
    'non-strategic-common': { value3: '1235' },
    'grc-weekly-hearing-list': { value4: '1236' },
};

describe('Non Strategic Tribunal Lists Controller', () => {
    const response = {
        render: () => {
            return '';
        },
    } as unknown as Response;

    it('should render error page if query param is empty', async () => {
        const request = mockRequest(i18n);
        request.query = {};
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render list not found page if response is json response is 404', async () => {
        getPublicationJsonStub.withArgs('1234').resolves(HttpStatusCode.NotFound);
        getMetadataStub.withArgs('1234').resolves({});

        const request = mockRequest(i18n);
        request.query = { artefactId: '1234' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render list not found page if response is metadata response is 404', async () => {
        getPublicationJsonStub.withArgs('12345').resolves({});
        getMetadataStub.withArgs('12345').resolves(HttpStatusCode.NotFound);

        const request = mockRequest(i18n);
        request.query = { artefactId: '12345' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render list not found page if list type is unexpected', async () => {
        getPublicationJsonStub.withArgs('123456').resolves({});
        getMetadataStub.withArgs('123456').resolves({ listType: 'CIVIL_DAILY_CAUSE_LIST' });

        const request = mockRequest(i18n);
        request.query = { artefactId: '123456' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock
            .expects('render')
            .once()
            .withArgs('list-not-found', request.i18n.getDataByLanguage(request.lng)['list-not-found']);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render error page if bad request occurs', async () => {
        getPublicationJsonStub.withArgs('1234567').resolves(HttpStatusCode.BadRequest);
        getMetadataStub.withArgs('1234567').resolves({});

        const request = mockRequest(i18n);
        request.query = { artefactId: '1234567' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render without parent page when not present', async () => {
        getPublicationJsonStub.withArgs('12345678').resolves({ Hello: 'World' });
        getMetadataStub.withArgs('12345678').resolves({
            listType: 'GRC_WEEKLY_HEARING_LIST',
            provenance: 'MANUAL_UPLOAD',
            contentDate: '2024-12-12T00:00:00Z',
        });

        const request = mockRequest(i18n);
        request.query = { artefactId: '12345678' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['grc-weekly-hearing-list'],
            ...i18n['list-template'],
            ...i18n['non-strategic-common'],
            listData: { Hello: 'World' },
            provenance: 'MANUAL_UPLOAD',
            contentDate: '12 December 2024',
        };

        responseMock.expects('render').once().withArgs('style-guide/grc-weekly-hearing-list', expectedData);

        await nonStrategicTribunalListsController.get(request, response, 'grc-weekly-hearing-list');
        return responseMock.verify();
    });

    it('should render when parent page is present', async () => {
        getPublicationJsonStub.withArgs('123456789').resolves({ Hello: 'World' });
        getMetadataStub.withArgs('123456789').resolves({
            listType: 'CST_WEEKLY_HEARING_LIST',
            provenance: 'MANUAL_UPLOAD',
            contentDate: '2024-12-12T00:00:00Z',
        });

        const request = mockRequest(i18n);
        request.query = { artefactId: '123456789' };
        request.user = { userId: '123' };

        const responseMock = sinon.mock(response);

        const expectedData = {
            ...i18n['cst-weekly-hearing-list'],
            ...i18n['list-template'],
            ...i18n['cst-and-pht-weekly-hearing-list'],
            ...i18n['non-strategic-common'],
            listData: { Hello: 'World' },
            provenance: 'MANUAL_UPLOAD',
            contentDate: '12 December 2024',
        };

        responseMock.expects('render').once().withArgs('style-guide/cst-and-pht-weekly-hearing-list', expectedData);

        await nonStrategicTribunalListsController.get(request, response, 'cst-weekly-hearing-list');
        return responseMock.verify();
    });
});
