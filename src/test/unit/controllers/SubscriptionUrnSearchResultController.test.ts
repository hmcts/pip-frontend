import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import SubscriptionUrnSearchResultController from '../../../main/controllers/SubscriptionUrnSearchResultController';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const subscriptionSearchUrnResultController = new SubscriptionUrnSearchResultController(api);
const stub = sinon.stub(api, 'getSubscriptionByUrn');

describe('Subscription Search Urn Result Controller', () => {
  it('should render the urn search result page', () => {


    const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/subscriptionListResult.json'), 'utf-8');
    const subscriptionsData = JSON.parse(rawData);

    stub.withArgs('123456789').returns(subscriptionsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {'search-input': '123456789'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-urn-search-results');


    return subscriptionSearchUrnResultController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

  it('should render an error page if search input does not return any results', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    return subscriptionSearchUrnResultController.get(request, response).then(() => {
      responseMock.verify();
    });

  });


});
