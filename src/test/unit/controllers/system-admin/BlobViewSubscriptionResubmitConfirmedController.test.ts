import BlobViewSubscriptionResubmitConfirmedController from '../../../../main/controllers/system-admin/BlobViewSubscriptionResubmitConfirmedController';
import { Response } from 'express';
import { mockRequest } from '../../mocks/mockRequest';
import sinon from 'sinon';

const blobViewSubscriptionResubmitConfirmedController = new BlobViewSubscriptionResubmitConfirmedController();

const i18n = {
    'blob-view-subscription-resubmit-confirmed': {
        title: 'Subscription re-submitted',
    },
};

describe('Blob view subscription re-submit confirmed controller', () => {
    it('should render blob view subscription re-submit confirmed page', async () => {
        const response = {
            render: () => {
                return '';
            },
        } as unknown as Response;
        const request = mockRequest(i18n);
        request.query = { artefactId: '1234' };
        request.user = { userId: 10 };

        const responseMock = sinon.mock(response);
        responseMock
            .expects('render')
            .once()
            .withArgs('system-admin/blob-view-subscription-resubmit-confirmed', { title: 'Subscription re-submitted' });
        blobViewSubscriptionResubmitConfirmedController.get(request, response);
        responseMock.verify;
    });
});
