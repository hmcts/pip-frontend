import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/subscriptionService';

const subscriptionManagementController = new SubscriptionManagementController();

sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns([]);
sinon.stub(SubscriptionService.prototype, 'generateCourtTableRows').returns([]);

describe('Subscription Management Controller', () => {
  const i18n = {
    'subscription-management': {},
  };
  const tableData = {
    caseTableData: [],
    courtTableData: [],
  };

  it('should render the subscription management page with all as default', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with all query param', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'all': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with case query param', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'case': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: false,
      activeCaseTab: true,
      activeCourtTab: false,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with court query param', () => {
    const response = { render: () => {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'court': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: false,
      activeCaseTab: false,
      activeCourtTab: true,
    };

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });
});
