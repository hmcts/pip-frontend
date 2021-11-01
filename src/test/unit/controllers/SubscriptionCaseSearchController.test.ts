import sinon from 'sinon';
import { Response } from 'express';
import SubscriptionCaseSearchController from '../../../main/controllers/SubscriptionCaseSearchController';
import fs from 'fs';
import path from 'path';
import {mockRequest} from '../mocks/mockRequest';
import {SubscriptionCaseSearchRequests} from '../../../main/resources/requests/subscriptionCaseSearchRequests';

const subscriptionCaseSearchController = new SubscriptionCaseSearchController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionCaseResult = JSON.parse(rawData);
const stub = sinon.stub(SubscriptionCaseSearchRequests.prototype, 'getSubscriptionCaseDetails');

const validCaseNo = 'ABC12345';

describe('Subscription Case Search Controller', () => {
  let i18n = {};
  it('should render the search page', () => {

    i18n = {
      'subscription-urn-search': {},
    };

    const response = {
      render: function () {
        return '';
      },
    } as unknown as Response;
    const request = mockRequest(i18n);

    const responseMock = sinon.mock(response);

    const expectedData = {
      ...i18n['subscription-case-search'],
    };

    responseMock.expects('render').once().withArgs('subscription-case-search', expectedData);

    subscriptionCaseSearchController.get(request, response);

    responseMock.verify();
  });

  it('should render case search page if there are no matching results', () => {

    stub.withArgs(validCaseNo).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': validCaseNo};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if input is less than three characters long', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '12'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if input is three characters long and partially correct', () => {

    stub.withArgs('1234').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '1234'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case search page if no input is provided', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': ''};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to case search results page with input as query if case number is valid', () => {

    const response = {
      redirect: function() {return '';},
      render: function() {return '';},
    } as unknown as Response;

    const request = mockRequest(i18n);

    request.body = { 'search-input': validCaseNo};

    const responseMock = sinon.mock(response);
    stub.withArgs(validCaseNo).returns(subscriptionCaseResult);

    responseMock.expects('redirect').once().withArgs('subscription-search-case-results?search-input=ABC12345');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
