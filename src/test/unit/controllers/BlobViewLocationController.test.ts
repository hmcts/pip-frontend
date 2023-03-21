import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import sinon from 'sinon';
import { LocationService } from '../../../main/service/locationService';
import BlobViewLocationController from '../../../main/controllers/BlobViewLocationController';
import { PublicationService } from '../../../main/service/publicationService';

const blobViewController = new BlobViewLocationController();
const i18n = {
    'blob-view-controller': {},
};

const map = new Map<string, number>([
    ['9', 1],
    ['1', 1],
    ['noMatch', 4],
]);
const locStub = sinon.stub(LocationService.prototype, 'fetchAllLocations');
const countStub = sinon.stub(PublicationService.prototype, 'getCountsOfPubsPerLocation');

describe('Get publications', () => {
    it('should render the blob locations listing page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;

        countStub.resolves(map);
        locStub.withArgs('en').resolves(JSON.parse('[{"name":"Single Justice Procedure", "locationId":9}]'));
        const request = mockRequest(i18n);
        request.query = { locationId: '1' };
        request.user = { id: 1 };

        const responseMock = sinon.mock(response);
        const expectedDictionary = new Map();
        expectedDictionary.set('Single Justice Procedure', [9, 1]);
        expectedDictionary.set('No match artefacts', ['noMatch', 4]);
        const expectedData = {
            ...i18n['blob-view-locations'],
            dictionaryOfLocations: expectedDictionary,
        };

        responseMock.expects('render').once().withArgs('blob-view-locations', expectedData);

        await blobViewController.get(request, response);
        responseMock.verify();
    });

    it('should render the error screen if the count endpoint fails', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        request.user = { id: 1 };
        locStub.withArgs('en').resolves(JSON.parse('[{"name":"Single Justice Procedure", "locationId":9}]'));
        countStub.resolves(undefined);

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error');
        await blobViewController.get(request, response);
        responseMock.verify;
    });

    it('should render the error screen if the location endpoint fails', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);

        request.user = { id: 1 };
        locStub.withArgs('en').resolves(undefined);
        countStub.resolves(map);

        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error');
        await blobViewController.get(request, response);
        responseMock.verify;
    });

    it('should render the error screen if the fetchAllLocations endpoint fails', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        countStub.resolves(map);
        const request = mockRequest(i18n);
        request.user = { id: 1 };
        const responseMock = sinon.mock(response);
        responseMock.expects('render').once().withArgs('error');
        responseMock.verify;
    });
});
