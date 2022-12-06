import BulkDeleteSubscriptionsConfirmedController from '../../../main/controllers/BulkDeleteSubscriptionsConfirmedController';
import sinon from 'sinon';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';

const bulkDeleteSubscriptionsConfirmedController = new BulkDeleteSubscriptionsConfirmedController();

describe('Bulk Delete Subscriptions Confirmed Controller', () => {
  describe('GET request', () => {
    const i18n = {'bulk-delete-subscriptions-confirmed': {}};
    const bulkDeleteConfirmedUrl = 'bulk-delete-subscriptions-confirmed';

    it('should render the bulk delete subscriptions confirmed page', () => {
      const response = { render: () => {return '';}} as unknown as Response;
      const responseMock = sinon.mock(response);
      const request = mockRequest(i18n);

      responseMock.expects('render').once().withArgs(bulkDeleteConfirmedUrl, i18n[bulkDeleteConfirmedUrl]);

      bulkDeleteSubscriptionsConfirmedController.get(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
});
