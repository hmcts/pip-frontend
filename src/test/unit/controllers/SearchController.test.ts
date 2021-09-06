import SearchController from '../../../main/controllers/SearchController';
import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from "../../../main/utils/PipApi";
import fs from "fs";
import path from "path";

const axios = require('axios');
jest.mock('axios');


const api = new PipApi(axios);
const searchController = new SearchController(api);
const stub = sinon.stub(api, 'getAllCourtList');

describe('Search Controller', () => {
  it('should render the search page', () => {


    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render search page if there are no matching results', () => {
    const searchController = new SearchController(api);


    stub.withArgs().returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'test'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render search page if input is less than three characters long', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'aa'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render search page if input is three characters long and partially correct', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'Mut'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render search page if input is not letters', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);
    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': '111'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render search page if no input is provided', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);
    const response = { render: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': ''}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('search');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });


  it('should redirect to search results page with input as query if input is valid', () => {

    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs().returns(hearingsData);
    const response = { redirect: function() {return '';}} as unknown as Response;
    const request = { body: { 'input-autocomplete': 'Basildon Combined Court'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('redirect').once().withArgs('search-results?search-input=Basildon Combined Court');

    return searchController.post(request, response).then(() => {
      responseMock.verify();
    });
  });
});
