import BulkDeleteSubscriptionsConfirmationController from '../../../main/controllers/BulkDeleteSubscriptionsConfirmationController';
import sinon from 'sinon';
import {Response} from 'express';
import {mockRequest} from '../mocks/mockRequest';
import {SubscriptionService} from '../../../main/service/subscriptionService';

const bulkDeleteSubscriptionsConfirmationController = new BulkDeleteSubscriptionsConfirmationController();

describe('Bulk Delete Subscriptions Confirmation Controller', () => {
  const i18n = {
    'bulk-delete-subscriptions-confirmation': {},
    'bulk-delete-subscriptions-confirmed': {},
    'error': {},
  };

  const bulkDeleteConfirmationUrl = 'bulk-delete-subscriptions-confirmation';
  const bulkDeleteConfirmedUrl = 'bulk-delete-subscriptions-confirmed';

  describe('GET request', () => {
    it('should render the bulk delete subscriptions confirmation page', () => {
      const response = { render: () => {return '';}} as unknown as Response;
      const responseMock = sinon.mock(response);
      const request = mockRequest(i18n);

      responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, i18n[bulkDeleteConfirmationUrl]);

      bulkDeleteSubscriptionsConfirmationController.get(request, response).then(() => {
        responseMock.verify();
      });
    });
  });

  describe('POST request', () => {
    const request = mockRequest(i18n);
    const response = { render: () => {return '';}, redirect: () => {return '';}} as unknown as Response;
    const stub = sinon.stub(SubscriptionService.prototype, 'bulkDeleteSubscriptions');

    beforeAll(() => {
      stub.withArgs(['aaa', 'bbb']).resolves(true);
      stub.withArgs(['foo']).resolves(undefined);
    });

    it('should render the bulk delete subscriptions confirmed page if \'Yes\' is selected', () => {
      const responseMock = sinon.mock(response);

      request.body = {'bulk-delete-choice': 'yes', subscriptions: 'aaa,bbb'};
      responseMock.expects('redirect').once().withArgs(bulkDeleteConfirmedUrl);

      bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render error page if \'Yes\' is selected and error from bulk deletion', () => {
      const responseMock = sinon.mock(response);

      request.body = {'bulk-delete-choice': 'yes', subscriptions: 'foo'};
      responseMock.expects('render').once().withArgs('error', i18n.error);

      bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should redirect to the subscriptions management page if \'No\' is selected', () => {
      const responseMock = sinon.mock(response);

      request.body = {'bulk-delete-choice': 'no'};
      responseMock.expects('redirect').once().withArgs('subscription-management');

      bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
        responseMock.verify();
      });
    });

    it('should render the bulk delete subscriptions confirmation page with error if no option selected', () => {
      const responseMock = sinon.mock(response);
      const expectedData = {
        ...i18n[bulkDeleteConfirmationUrl],
        noOptionSelectedError: true,
      };

      request.body = {};
      responseMock.expects('render').once().withArgs(bulkDeleteConfirmationUrl, expectedData);

      bulkDeleteSubscriptionsConfirmationController.post(request, response).then(() => {
        responseMock.verify();
      });
    });
  });
});
