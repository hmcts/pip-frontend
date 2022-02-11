import SubscriptionManagementController from '../../../main/controllers/SubscriptionManagementController';
import sinon from 'sinon';
import { Response } from 'express';
import { mockRequest } from '../mocks/mockRequest';
import { SubscriptionService } from '../../../main/service/subscriptionService';
import {cloneDeep} from 'lodash';

const subscriptionManagementController = new SubscriptionManagementController();

sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns({cases:[]});
sinon.stub(SubscriptionService.prototype, 'generateCourtTableRows').returns({courts:[]});

describe('Subscriptions Management Controller', () => {
  const i18n = {
    'subscription-management': {},
  };
  const tableData = {
    caseTableData: [],
    courtTableData: [],
  };
  const response = { render: () => {return '';}} as unknown as Response;
  const request = mockRequest(i18n);
  const responseMock = sinon.mock(response);

  const stubCase = [];
  const stubCourt = [];
  it('should render the subscription management page with all as default', () => {

    request.query = {};

    const expectedData = {
      ...cloneDeep(request.i18n.getDataByLanguage(request.lng)['subscription-management']),
      stubCase,
      stubCourt,
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };

    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render the subscription management page with all query param', () => {
    request.query = {'all': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: true,
      activeCaseTab: false,
      activeCourtTab: false,
    };

    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render the subscription management page with case query param', () => {
    request.query = {'case': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: false,
      activeCaseTab: true,
      activeCourtTab: false,
    };

    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render the subscription management page with court query param', () => {
    request.query = {'court': 'true'};

    const expectedData = {
      ...i18n['subscription-management'],
      ...tableData,
      activeAllTab: false,
      activeCaseTab: false,
      activeCourtTab: true,
    };

    responseMock.expects('render').once().withArgs('subscription-management', expectedData);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page if there is no user data', () => {
    request.user = undefined;

    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render error page if data is null', () => {
    sinon.restore();
    sinon.stub(SubscriptionService.prototype, 'generateCaseTableRows').returns(null);
    sinon.stub(SubscriptionService.prototype, 'generateCourtTableRows').returns(null);
    responseMock.expects('render').once().withArgs('error', request.i18n.getDataByLanguage(request.lng).error);

    subscriptionManagementController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
