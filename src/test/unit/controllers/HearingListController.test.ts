import HearingListController from '../../../main/controllers/HearingListController';
import sinon from 'sinon';
import { Request, Response } from 'express';
import {PipApi} from "../../../main/utils/PipApi";
import fs from "fs";
import path from "path";

const axios = require('axios');
jest.mock('axios');
const api = new PipApi(axios);

const hearingListController = new HearingListController(api);
const stub = sinon.stub(api, 'getHearingList');


describe('Hearing list Controller', () => {
  it('should render the list page if the court ID exists', () =>  {
    const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/hearingsListByCourt.json'), 'utf-8');
    const hearingsData = JSON.parse(rawData);

    stub.withArgs(2).returns(hearingsData);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = {query: {courtId: 2}, headers: {referer: '/referred-page'}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('hearing-list');

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });

  });

  it('should render an error page if a court ID that does not return any results', () =>  {
    stub.withArgs(1400).returns(null);

    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: { courtId: 1400}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

  it('should render an error page if a court ID is not defined', () =>  {

    stub.withArgs({}).returns(null);
    const response = { render: function() {return '';}} as unknown as Response;
    const request = { query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('error');

    return hearingListController.get(request, response).then(() => {
      responseMock.verify();
    });
  });

});
