import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import { LocationService } from '../../../../main/service/LocationService';
import LocationMetadataManageController from '../../../../main/controllers/system-admin/LocationMetadataManageController';

const locationMetadataManageController = new LocationMetadataManageController();

const i18n = {
    'location-metadata-manage': { title: 'Manage location metadata' },
};

sinon.stub(LocationService.prototype, 'getLocationById').resolves({ name: 'Location A' });

const getLocationMetadataStub = sinon.stub(LocationService.prototype, 'getLocationMetadata');
getLocationMetadataStub.withArgs('123').resolves({ locationMetadataId: '123-456' });
getLocationMetadataStub.withArgs('124').resolves({ locationMetadataId: '123-457' });
getLocationMetadataStub.withArgs('125').resolves(null);

const updateLocationMetadataStub = sinon.stub(LocationService.prototype, 'updateLocationMetadata');
updateLocationMetadataStub.withArgs('123-456').resolves(true);
updateLocationMetadataStub.withArgs('123-457').resolves(false);

describe('Location metadata manage controller', () => {
    const response = {
        render: () => {
            return '';
        },
        redirect: () => {
            return '';
        },
    } as unknown as Response;

    describe('GET request', () => {
        it('should render location metadata manage page', () => {
            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-manage'],
                location: { name: 'Location A' },
                locationMetadata: { locationMetadataId: '123-456' },
                updateError: false,
            };
            responseMock.expects('render').once().withArgs('system-admin/location-metadata-manage', expectedData);

            locationMetadataManageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if location ID not supplied', () => {
            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            locationMetadataManageController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });

    describe('POST request', () => {
        it('should redirect to location metadata create confirmed page if success when creating metadata', () => {
            const response = {
                render: () => {
                    return '';
                },
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request['query'] = { locationId: '125' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-metadata-create-confirmed');

            locationMetadataManageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should redirect to location metadata update confirmed page if success when updating metadata', () => {
            const response = {
                render: () => {
                    return '';
                },
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request['query'] = { locationId: '123' };
            const responseMock = sinon.mock(response);

            responseMock.expects('redirect').once().withArgs('location-metadata-update-confirmed');

            locationMetadataManageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render location metadata manage page with error if error when updating metadata', () => {
            const response = {
                render: () => {
                    return '';
                },
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            request['query'] = { locationId: '124' };
            const responseMock = sinon.mock(response);

            const expectedData = {
                ...i18n['location-metadata-manage'],
                location: { name: 'Location A' },
                locationMetadata: { locationMetadataId: '123-457' },
                updateError: true,
            };
            responseMock.expects('render').once().withArgs('system-admin/location-metadata-manage', expectedData);

            locationMetadataManageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });

        it('should render the error page if location ID not supplied', () => {
            const response = {
                render: () => {
                    return '';
                },
                redirect: () => {
                    return '';
                },
            } as unknown as Response;

            const request = mockRequest(i18n);
            const responseMock = sinon.mock(response);

            responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

            locationMetadataManageController.post(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
