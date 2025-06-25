import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';
import LocationMetadataCreateConfirmedController from '../../../../main/controllers/system-admin/LocationMetadataCreateConfirmedController';

const locationMetadataCreateConfirmedController = new LocationMetadataCreateConfirmedController();

const i18n = {
    'location-metadata-create-confirmed': {
        title: 'Location metadata created',
    },
};

describe('Location metadata create confirmed controller', () => {
    it('should render location metadata create confirmed page', async () => {
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
            .withArgs('system-admin/location-metadata-create-confirmed', { title: 'Location metadata created' });
        locationMetadataCreateConfirmedController.get(request, response).then(() => {
            responseMock.verify();
        });
    });
});
