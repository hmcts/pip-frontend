import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import LocationMetadataDeleteConfirmationController from '../../../../main/controllers/system-admin/LocationMetadataDeleteConfirmationController';
import { LocationService } from '../../../../main/service/LocationService';

const locationMetadataDeleteConfirmationController = new LocationMetadataDeleteConfirmationController();

const response = {
    render: () => {
        return '';
    },
    redirect: () => {
        return '';
    },
} as unknown as Response;

const i18n = {
    'location-metadata-delete-confirmation': { title: 'Are you sure you want to delete?' },
};

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });

const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
getLocationMetadataStub.withArgs('123').resolves({ locationMetadataId: '123-456' });
getLocationMetadataStub.withArgs('124').resolves({ locationMetadataId: '123-457' });
getLocationMetadataStub.withArgs('125').resolves(null);

const deleteLocationMetadataStub = sinon.stub(LocationService.prototype, 'deleteLocationMetadataById');
deleteLocationMetadataStub.withArgs('123-456').resolves(true);
deleteLocationMetadataStub.withArgs('123-457').resolves(false);

describe('Location metadata delete confirmation controller', () => {
    describe('GET request', () => {
        it('should render location metadata delete confirmation page', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-delete-confirmation'],
                location: { name: 'Location A' },
                noOptionError: false,
                failedRequestError: false,
            };
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/location-metadata-delete-confirmation', expectedData);

            locationMetadataDeleteConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if location ID not supplied', () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            locationMetadataDeleteConfirmationController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should render location metadata delete confirmation page with error if no option selected', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-delete-confirmation'],
                location: { name: 'Location A' },
                noOptionError: true,
                failedRequestError: false,
            };
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/location-metadata-delete-confirmation', expectedData);

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should redirect to location metadata manage page with if 'No' is selected", () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            request['body'] = { 'delete-location-metadata-confirm': 'no' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-metadata-manage?locationId=123');

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should redirect to location metadata delete confirmed page if 'Yes' is selected and success when deleting metadata", () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            request['body'] = { 'delete-location-metadata-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-metadata-delete-confirmed');

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it("should render location metadata delete confirmation page with error if 'Yes' is selected but error when deleting metadata", () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '124' };
            request['body'] = { 'delete-location-metadata-confirm': 'yes' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-delete-confirmation'],
                location: { name: 'Location A' },
                noOptionError: false,
                failedRequestError: true,
            };
            responseMock
                .expects('render')
                .once()
                .withArgs('system-admin/location-metadata-delete-confirmation', expectedData);

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if location ID not supplied', () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if location has no metadata', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '125' };
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            locationMetadataDeleteConfirmationController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
