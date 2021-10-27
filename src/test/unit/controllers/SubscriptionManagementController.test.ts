import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Response } from 'express';
import {mockRequest} from '../mocks/mockRequest';
import {SubscriptionService} from '../../../main/service/subscriptionService';

const subscriptionManagementController = new SubscriptionManagementController();

sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns([]);
sinon.stub(SubscriptionService.prototype, 'generateCourtTableRows').returns([]);

export interface AuthenticatedRequest extends Request {
  user: {
    displayName: string;
  };
}

describe('Subscription Management Controller', () => {
  it('should render the subscription management page with all as default', () => {

    const i18n = {
      'subscription-management': {},
    };

<<<<<<< HEAD
    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {}, user: {displayName: 'abcd'}} as unknown as Request;
=======
    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {};

    const expectedData = {
      ...i18n['subscription-management'],
      caseTableData: [],
      courtTableData: [],
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };
>>>>>>> master

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with all query param', () => {

<<<<<<< HEAD
    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {all: true},  user: {displayName: 'abcd'}} as unknown as Request;
=======
    const i18n = {
      'subscription-management': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'all': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      caseTableData: [],
      courtTableData: [],
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };
>>>>>>> master

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with case query param', () => {
<<<<<<< HEAD
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {case: true},  user: {displayName: 'abcd'}} as unknown as Request;
=======
    const i18n = {
      'subscription-management': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'case': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      caseTableData: [],
      courtTableData: [],
      activeAllTab: false,
      activeCaseTab: true,
      activeCourtTab: false,
    };
>>>>>>> master

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });

  it('should render the subscription management page with court query param', () => {
<<<<<<< HEAD
    const subscriptionManagementController = new SubscriptionManagementController();

    const response = {
      render: () => {return '';},
    } as unknown as Response;
    const request = {query: {court: true},  user: {displayName: 'abcd'}} as unknown as Request;
=======
    const i18n = {
      'subscription-management': {},
    };

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.query = {'court': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      caseTableData: [],
      courtTableData: [],
      activeAllTab: false,
      activeCaseTab: false,
      activeCourtTab: true,
    };
>>>>>>> master

    const responseMock = sinon.mock(response);
    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response);
    responseMock.verify();
  });
});
