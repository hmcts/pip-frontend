import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import LocationMetadataUpdateConfirmedController from '../../../../main/controllers/system-admin/LocationMetadataUpdateConfirmedController';

const locationMetadataUpdateConfirmedController = new LocationMetadataUpdateConfirmedController();

const i18n = {
    'location-metadata-update-confirmed': {
        title: 'Location metadata updated',
    },
};

describe('Location metadata update confirmed controller', () => {
    it('should render location metadata update confirmed page', async () => {
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
            .withArgs('system-admin/location-metadata-update-confirmed', { title: 'Location metadata updated' });
        locationMetadataUpdateConfirmedController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
