import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchController from '../../../main/controllers/SubscriptionUrnSearchController';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const subscriptionUrnSearchController = new SubscriptionUrnSearchController(api);
const stub = sinon.stub(api, 'getSubscriptionByUrn');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/subscriptionListResult.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);

stub.withArgs('123456789').returns(subscriptionResult);

describe('Subscription Urn Search Controller', () => {
  it('should render the search page', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    subscriptionUrnSearchController.get(request, response);

    responseMock.verify();

  });

  it('should render urn search page if there are no matching results', () => {

    stub.withArgs('12345678').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': '12345678'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render urn search page if input is less than three characters long', () => {

    stub.withArgs('12').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': '12'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should render urn search page if input is three characters long and partially correct', () => {

    stub.withArgs('1234').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': '1234'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render urn search page if no input is provided', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to urn search results page with input as query if urn input is valid', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': '123456789'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('subscription-search-urn-results?search-input=123456789');

    return subscriptionUrnSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

});
