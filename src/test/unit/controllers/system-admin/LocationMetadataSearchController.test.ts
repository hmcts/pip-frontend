import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { LocationService } from '../../../../main/service/LocationService';
import LocationMetadataSearchController from '../../../../main/controllers/system-admin/LocationMetadataSearchController';

const locationMetadataSearchController = new LocationMetadataSearchController();

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const i18n = {
    'location-metadata-search': { title: 'Search for location metadata by court or tribunal name' },
};

const autocompleteList = [{ name: 'Location A' }, { name: 'Location B' }];
sinon.stub(LocationService.prototype, 'fetchAllLocations').resolves(autocompleteList);

const getLocationByNameStub = sinon.stub(LocationService.prototype, 'getLocationByName');
getLocationByNameStub.withArgs('Location A').resolves({ locationId: '123', name: 'Location A' });
getLocationByNameStub.withArgs('Location C').resolves(null);

describe('Location metadata search controller', () => {
    describe('GET request', () => {
        it('should render location metadata search page', () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-search'],
                autocompleteList,
                invalidInputError: false,
                noResultsError: false,
            };
            responseMock.expects('render').once().withArgs('system-admin/location-metadata-search', expectedData);

            locationMetadataSearchController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should redirect to location metadata manage page if search input exists and returns a location', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            request['body'] = { 'input-autocomplete': 'Location A' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-metadata-manage?locationId=123');

            locationMetadataSearchController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render location metadata search page with error if search input exists but does not return a location', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            request['body'] = { 'input-autocomplete': 'Location C' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-search'],
                autocompleteList,
                invalidInputError: false,
                noResultsError: true,
            };
            responseMock.expects('render').once().withArgs('system-admin/location-metadata-search', expectedData);

            locationMetadataSearchController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render location metadata search page with error if search input does not exist', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-search'],
                autocompleteList,
                invalidInputError: true,
                noResultsError: false,
            };
            responseMock.expects('render').once().withArgs('system-admin/location-metadata-search', expectedData);

            locationMetadataSearchController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
