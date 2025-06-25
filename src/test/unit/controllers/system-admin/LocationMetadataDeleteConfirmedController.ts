import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import LocationMetadataDeleteConfirmedController from '../../../../main/controllers/system-admin/LocationMetadataDeleteConfirmedController';

const locationMetadataDeleteConfirmedController = new LocationMetadataDeleteConfirmedController();

const i18n = {
    'location-metadata-delete-confirmed': {
        title: 'Location metadata deleted',
    },
};

describe('Location metadata delete confirmed controller', () => {
    it('should render location metadata delete confirmed page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.user = { userId: 10 };

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/location-metadata-delete-confirmed', { title: 'Location metadata deleted' });
        locationMetadataDeleteConfirmedController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
