import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import SubscriptionCaseSearchResultController from '../../../main/controllers/SubscriptionCaseSearchResultController';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const subscriptionCaseSearchResultController = new SubscriptionCaseSearchResultController(api);
const stub = sinon.stub(api, 'getSubscriptionByCaseReference');

describe('Subscription Search Case Reference Result Controller', () => {
  it('should render the Case Reference search result page', () => {


    const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/subscriptionCaseList.json'), 'utf-8');
    const subscriptionsCaseData = JSON.parse(rawData);

    stub.withArgs('ABC12345').returns(subscriptionsCaseData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {'search-input': 'ABC12345'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-search-case-results');


    return subscriptionCaseSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

  it('should render an error page if search input does not return any results', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    return subscriptionCaseSearchResultController.get(request, response).then(() => {
      responseMock.verify();
    });

  });


});
