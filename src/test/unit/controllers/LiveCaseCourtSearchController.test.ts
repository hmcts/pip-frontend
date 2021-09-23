import sinon from 'sinon';
import { Request, Response } from 'express';
import LiveCaseCourtSearchController from '../../../main/controllers/LiveCaseCourtSearchController';
import fs from 'fs';
import path from 'path';
import {PipApi} from '../../../main/utils/PipApi';

const axios = require('axios');
jest.mock('axios');
const api = new PipApi(axios);
const stub = sinon.stub(api, 'getAllCourtList');
const rawData = fs.readFileSync(path.resolve(__dirname, '../mocks/courtsAndHearingsCount.json'), 'utf-8');
const hearingsData = JSON.parse(rawData);
describe('Live Case Court Search Controller', () => {
  it('should render live cases alphabetical page', () => {
    const liveCaseCourtSearchController = new LiveCaseCourtSearchController(api);

    stub.withArgs().returns(hearingsData);

    const response = {
      render: () => {return '';},
      get: () => {return '';},
    } as unknown as Response;
    const request = {query: {}} as unknown as Request;

    const responseMock = sinon.mock(response);

    responseMock.expects('render').once().withArgs('live-case-alphabet-search');

    return liveCaseCourtSearchController.get(request, response).then(() => {
      responseMock.verify();
    });
  });
});
