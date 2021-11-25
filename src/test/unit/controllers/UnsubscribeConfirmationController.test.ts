import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import sinon from 'sinon';
import UnsubscribeConfirmationController from '../../../main/controllers/UnsubscribeConfirmationController';


const stub = sinon.stub(SubscriptionService.prototype, 'unsubscribe');
const validBody = {'unsubscribe-confirm': 'yes', subscription: 'valid subscription'};
const invalidBody = {'unsubscribe-confirm': 'yes', subscription: 'foo'};
const redirectBody = {'unsubscribe-confirm': 'no'};
const unsubscribeConfirmationController = new UnsubscribeConfirmationController();

describe('Unsubscribe Confirmation Controller', () => {
  beforeEach(() => {
    stub.withArgs({...validBody, userId: '1'}).resolves(true);
    stub.withArgs({...invalidBody, userId: '1'}).resolves(undefined);
  });

  const i18n = {
    'unsubscribe-confirmation': {},
    error: {},
  };
  const response = { render: () => {return '';}, redirect: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  request['user'] = {id: '1'};

  it('should render unsubscribe confirmation page if valid body data is provided', () => {
    request.body = validBody;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('unsubscribe-confirmation', {...i18n['unsubscribe-confirmation']});

    return unsubscribeConfirmationController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page is unsubscribe call fails', () => {
    request.body = invalidBody;
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error', {...i18n.error});

    return unsubscribeConfirmationController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to subscription management if unsubscribe-confirm is set to no', () => {
    request.body = redirectBody;
    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('/subscription-management');

    return unsubscribeConfirmationController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
