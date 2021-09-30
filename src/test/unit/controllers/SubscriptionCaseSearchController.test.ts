import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from '../../../main/utils/PipApi';
import fs from 'fs';
import path from 'path';
import SubscriptionCaseSearchController from '../../../main/controllers/SubscriptionCaseSearchController';

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const subscriptionCaseSearchController = new SubscriptionCaseSearchController(api);
const stub = sinon.stub(api, 'getSubscriptionByCaseReference');
const rawData = fs.readFileSync(path.resolve(__dirname, '../../../main/resources/mocks/subscriptionCaseList.json'), 'utf-8');
const subscriptionResult = JSON.parse(rawData);

const validCaseNo = 'ABC12345';

stub.withArgs(validCaseNo).returns(subscriptionResult);

describe('Subscription case reference Search Controller', () => {
  it('should render the search page', () => {

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    subscriptionCaseSearchController.get(request, response);

    responseMock.verify();

  });

  it('should render case reference search page if there are no matching results', () => {

    stub.withArgs(validCaseNo).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': validCaseNo}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case reference search page if input is less than three characters long', () => {

    stub.withArgs('AB').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': 'AB'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should render case reference search page if input is three characters long and partially correct', () => {

    stub.withArgs('ABC1').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': 'ABC1'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render case reference search page if no input is provided', () => {

    stub.withArgs('').returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('subscription-case-search');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should redirect to case reference search results page with input as query if case reference input is valid', () => {

    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'search-input': validCaseNo}} as unknown as Request;
    stub.withArgs(validCaseNo).returns(subscriptionResult);

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('subscription-search-case-results?search-input=ABC12345');

    return subscriptionCaseSearchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

});
