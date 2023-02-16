import BulkUnsubscribeConfirmedController from '../../../main/controllers/BulkUnsubscribeConfirmedController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';

const bulkDeleteSubscriptionsConfirmedController = new BulkUnsubscribeConfirmedController();

describe('Bulk Unsubscribe Confirmed Controller', () => {
    describe('GET request', () => {
        const i18n = { 'bulk-unsubscribe-confirmed': {} };
        const bulkDeleteConfirmedUrl = 'bulk-unsubscribe-confirmed';

        it('should render the bulk unsubscribe confirmed page', () => {
            const response = {
                render: () => {
                    return '';
                },
            } as unknown as Response;
            const responseMock = sinon.mock(response);
            const request = mockRequest(i18n);

            responseMock.expects('render').once().withArgs(bulkDeleteConfirmedUrl, i18n[bulkDeleteConfirmedUrl]);

            bulkDeleteSubscriptionsConfirmedController.get(request, response).then(() => {
                responseMock.verify();
            });
        });
    });
});
