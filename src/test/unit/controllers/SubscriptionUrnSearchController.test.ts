import sinon from 'sinon';
import { Response } from 'express';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchController from '../../../main/controllers/SubscriptionUrnSearchController';
import {mockRequest} from '../mocks/mockRequest';
import {SubscriptionService} from '../../../main/service/subscriptionService';

const subscriptionUrnSearchController = new SubscriptionUrnSearchController();
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);
const stub = sinon.stub(SubscriptionService.prototype, 'getSubscriptionUrnDetails');


describe('Subscription Urn Search Controller', () => {
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
      ...i18n['subscription-urn-search'],
    };

    responseMock.expects('render').once().withArgs('subscription-urn-search', expectedData);

    subscriptionUrnSearchController.get(request, response);

    responseMock.verify();

  });


  it('should render urn search page if there are no matching results', () => {

    stub.withArgs('12345678').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '12345678'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render urn search page if input is less than three characters long', () => {



    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '12'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should render urn search page if input is three characters long and partially correct', () => {

    stub.withArgs('1234').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '1234'};

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render urn search page if no input is provided', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': ''};
    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to urn search results page with input as query if urn input is valid', () => {

    const response = {
      redirect: function() {return '';},
      render: function() {return '';},
    } as unknown as Response;
    const request = mockRequest(i18n);
    request.body = { 'search-input': '123456789'};
    const responseMock = sinon.mock(response);
    stub.withArgs('123456789').returns(subscriptionResult);
    responseMock.expects('redirect').once().withArgs('subscription-urn-search-results?search-input=123456789');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
